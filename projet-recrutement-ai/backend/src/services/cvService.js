import { Readable } from "stream";
import axios from "axios";
import { getCvBucket } from "../config/gridfs.js";
import Cv from "../models/Cv.js";
import prisma from "../config/db.js";

/**
 * Asynchronously triggers the n8n webhook via HTTP POST (non-blocking).
 * Does not await completion so the user receives an immediate response.
 */
export const triggerN8nCvWebhookAsync = (cvDoc, eventType = "CV_UPLOADED") => {
    const webhookUrl = process.env.N8N_CV_WEBHOOK_URL || "https://n8n.iksatech.com/webhook/cv-uploaded";

    if (!webhookUrl) {
        console.warn("[n8n Webhook Warning] N8N_CV_WEBHOOK_URL environment variable is missing.");
        return;
    }

    const publicBaseUrl = process.env.BACKEND_PUBLIC_URL || "https://dripping-hangup-detonator.ngrok-free.dev";

    const payload = {
        cvId: cvDoc._id ? cvDoc._id.toString() : cvDoc.id,
        event: eventType, // 'CV_UPLOADED' | 'CV_EDITED'
        userId: cvDoc.userId,
        fileId: cvDoc.fileId ? cvDoc.fileId.toString() : undefined,
        originalName: cvDoc.originalName,
        fileUrl: `${publicBaseUrl}/api/cvs/${cvDoc._id}/file`,
        downloadUrl: `${publicBaseUrl}/api/cvs/${cvDoc.userId}/download`,
        status: cvDoc.status || "PROCESSING",
        timestamp: new Date().toISOString(),
    };

    console.log(`[n8n Webhook] Sending async POST to ${webhookUrl} (cvId: ${payload.cvId}, event: ${eventType})`);

    // Non-blocking fire-and-forget HTTP request via axios
    axios.post(webhookUrl, payload, {
        headers: {
            "Content-Type": "application/json",
            ...(process.env.WEBHOOK_SECRET ? { "x-webhook-secret": process.env.WEBHOOK_SECRET } : {}),
        },
        timeout: 15000,
    })
    .then((res) => {
        console.log(`[n8n Webhook Success] Triggered successfully. HTTP Status: ${res.status}`);
    })
    .catch((err) => {
        console.error(`[n8n Webhook Error] Async trigger failed for cvId ${payload.cvId}:`, err.message);
    });
};

/**
 * Upload or edit CV PDF file in MongoDB GridFS and save metadata in MongoDB with status "PROCESSING"
 */
export const uploadOrUpdateCvToGridFS = async (userId, file) => {
    const bucket = getCvBucket();

    // 1. Check if user already has a CV (determines whether event is CV_EDITED or CV_UPLOADED)
    const existingCv = await Cv.findOne({ userId });
    let isEdit = false;

    if (existingCv) {
        isEdit = true;
        try {
            await bucket.delete(existingCv.fileId);
        } catch (err) {
            console.warn(`[GridFS Warning] Deleting old fileId ${existingCv.fileId}:`, err.message);
        }
        await Cv.deleteOne({ userId });
    }

    // 2. Generate unique GridFS filename
    const uniqueFilename = `cv-${userId}-${Date.now()}.pdf`;

    // 3. Pipe memory buffer into GridFS stream
    const uploadStream = bucket.openUploadStream(uniqueFilename, {
        contentType: file.mimetype || "application/pdf",
        metadata: {
            userId,
            originalName: file.originalname,
        },
    });

    await new Promise((resolve, reject) => {
        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(uploadStream)
            .on("error", (error) => reject(error))
            .on("finish", () => resolve());
    });

    const fileId = uploadStream.id;

    // 4. Save metadata document in MongoDB with initial status "PROCESSING"
    const cvDoc = await Cv.create({
        userId,
        fileId,
        originalName: file.originalname,
        mimeType: file.mimetype || "application/pdf",
        size: file.size || file.buffer.length,
        status: "PROCESSING",
        parsedData: null,
    });

    // 5. Update candidate record in Prisma MySQL
    try {
        const viewUrl = `/api/cvs/${userId}/view`;
        await prisma.candidate.update({
            where: { userId },
            data: { cvPath: viewUrl },
        });
    } catch (prismaErr) {
        console.warn("[Prisma Warning] Could not sync candidate cvPath:", prismaErr.message);
    }

    // 6. Trigger n8n webhook asynchronously (non-blocking)
    const eventType = isEdit ? "CV_EDITED" : "CV_UPLOADED";
    triggerN8nCvWebhookAsync(cvDoc, eventType);

    return { cvDoc, eventType };
};

/**
 * Get CV metadata document by userId
 */
export const getCvMetadataByUserId = async (userId) => {
    return Cv.findOne({ userId });
};

/**
 * Open download stream from GridFS by fileId
 */
export const getCvDownloadStream = (fileId) => {
    const bucket = getCvBucket();
    return bucket.openDownloadStream(fileId);
};

/**
 * Delete CV GridFS file, chunks, and metadata for a user
 */
export const deleteCvByUserId = async (userId) => {
    const cvDoc = await Cv.findOne({ userId });
    if (!cvDoc) {
        return false;
    }

    const bucket = getCvBucket();

    try {
        await bucket.delete(cvDoc.fileId);
    } catch (err) {
        console.warn(`[GridFS Warning] Error deleting fileId ${cvDoc.fileId}:`, err.message);
    }

    await Cv.deleteOne({ userId });

    try {
        await prisma.candidate.update({
            where: { userId },
            data: { cvPath: null },
        });
    } catch (prismaErr) {
        console.warn("[Prisma Warning] Could not clear candidate cvPath:", prismaErr.message);
    }

    return true;
};
