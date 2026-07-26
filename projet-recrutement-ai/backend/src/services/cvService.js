import { Readable } from "stream";
import { getCvBucket } from "../config/gridfs.js";
import Cv from "../models/Cv.js";
import prisma from "../config/db.js";

/**
 * Upload a PDF file directly to MongoDB GridFS and save metadata in the cvs collection.
 */
export const uploadCvToGridFS = async (userId, file) => {
    const bucket = getCvBucket();

    // 1. Remove existing CV for this user if one already exists
    const existingCv = await Cv.findOne({ userId });
    if (existingCv) {
        try {
            await bucket.delete(existingCv.fileId);
        } catch (err) {
            console.warn(`GridFS file ${existingCv.fileId} deletion warning:`, err.message);
        }
        await Cv.deleteOne({ userId });
    }

    // 2. Generate unique filename
    const uniqueFilename = `cv-${userId}-${Date.now()}.pdf`;

    // 3. Create GridFS upload stream
    const uploadStream = bucket.openUploadStream(uniqueFilename, {
        contentType: file.mimetype || "application/pdf",
        metadata: {
            userId,
            originalName: file.originalname,
        },
    });

    // 4. Pipe buffer into GridFS stream using Promise
    await new Promise((resolve, reject) => {
        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(uploadStream)
            .on("error", (error) => reject(error))
            .on("finish", () => resolve());
    });

    const fileId = uploadStream.id;

    // 5. Create CV Metadata document in MongoDB
    const cvDoc = await Cv.create({
        userId,
        fileId,
        originalName: file.originalname,
        mimeType: file.mimetype || "application/pdf",
        size: file.size || file.buffer.length,
        status: "uploaded",
        parsedData: null,
    });

    // 6. Sync candidate profile in Prisma MySQL
    try {
        const viewUrl = `/api/cvs/${userId}/view`;
        await prisma.candidate.update({
            where: { userId },
            data: { cvPath: viewUrl },
        });
    } catch (prismaErr) {
        console.warn("Prisma sync warning (candidate record might not exist yet):", prismaErr.message);
    }

    return cvDoc;
};

/**
 * Get CV metadata document by userId
 */
export const getCvMetadataByUserId = async (userId) => {
    return Cv.findOne({ userId });
};

/**
 * Open a download stream from GridFS by fileId
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

    // 1. Delete GridFS file & chunks
    try {
        await bucket.delete(cvDoc.fileId);
    } catch (err) {
        console.warn(`GridFS delete error for fileId ${cvDoc.fileId}:`, err.message);
    }

    // 2. Delete metadata doc
    await Cv.deleteOne({ userId });

    // 3. Clear cvPath in Prisma candidate record
    try {
        await prisma.candidate.update({
            where: { userId },
            data: { cvPath: null },
        });
    } catch (prismaErr) {
        console.warn("Prisma clear cvPath warning:", prismaErr.message);
    }

    return true;
};
