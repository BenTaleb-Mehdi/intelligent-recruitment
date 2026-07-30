import * as cvService from "../services/cvService.js";

/**
 * Controller: Upload CV PDF file to MongoDB GridFS and start processing
 * POST /api/cvs/upload
 */
export const uploadCv = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Bad Request",
                error: "No PDF file provided in request. Please attach a file under key 'cv'.",
            });
        }

        const userId = req.user.id;
        const { cvDoc, eventType } = await cvService.uploadOrUpdateCvToGridFS(userId, req.file);

        return res.status(200).json({
            success: true,
            message: eventType === "CV_EDITED" ? "CV updated successfully. Processing initiated." : "CV uploaded successfully. Processing initiated.",
            data: {
                id: cvDoc._id,
                userId: cvDoc.userId,
                fileId: cvDoc.fileId,
                originalName: cvDoc.originalName,
                mimeType: cvDoc.mimeType,
                size: cvDoc.size,
                status: cvDoc.status, // "PROCESSING"
                event: eventType, // 'CV_UPLOADED' | 'CV_EDITED'
                viewUrl: `/api/cvs/${userId}/view`,
                downloadUrl: `/api/cvs/${userId}/download`,
                n8nFileUrl: `/api/cvs/${userId}/file`,
                createdAt: cvDoc.createdAt,
                updatedAt: cvDoc.updatedAt,
            },
        });
    } catch (error) {
        console.error("Error in uploadCv controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || "Failed to process CV upload.",
        });
    }
};

/**
 * Controller: Edit / Replace existing CV PDF file in MongoDB GridFS
 * PUT /api/cvs/edit
 */
export const editCv = async (req, res) => {
    return uploadCv(req, res);
};

/**
 * Controller: Download PDF from GridFS (Content-Disposition: attachment)
 * GET /api/cvs/:userId/download
 */
export const downloadCv = async (req, res) => {
    try {
        const { userId } = req.params;
        const cvDoc = await cvService.getCvMetadataByUserId(userId);

        if (!cvDoc) {
            return res.status(404).json({
                success: false,
                message: "Not Found",
                error: "No CV document found for this user.",
            });
        }

        const filename = encodeURIComponent(cvDoc.originalName || "CV.pdf");
        res.setHeader("Content-Type", cvDoc.mimeType || "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        if (cvDoc.size) {
            res.setHeader("Content-Length", cvDoc.size);
        }

        const downloadStream = cvService.getCvDownloadStream(cvDoc.fileId);

        downloadStream.on("error", (error) => {
            console.error("GridFS Download Stream error:", error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error",
                    error: "Error streaming file from database.",
                });
            }
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error in downloadCv controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Controller: View PDF inline in browser (Content-Disposition: inline)
 * GET /api/cvs/:userId/view
 */
export const viewCv = async (req, res) => {
    try {
        const { userId } = req.params;
        const cvDoc = await cvService.getCvMetadataByUserId(userId);

        if (!cvDoc) {
            return res.status(404).json({
                success: false,
                message: "Not Found",
                error: "No CV document found for this user.",
            });
        }

        const filename = encodeURIComponent(cvDoc.originalName || "CV.pdf");
        res.setHeader("Content-Type", cvDoc.mimeType || "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
        if (cvDoc.size) {
            res.setHeader("Content-Length", cvDoc.size);
        }

        const downloadStream = cvService.getCvDownloadStream(cvDoc.fileId);

        downloadStream.on("error", (error) => {
            console.error("GridFS View Stream error:", error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error",
                    error: "Error streaming file inline from database.",
                });
            }
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error in viewCv controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Controller: Stream PDF directly for n8n workflow integration
 * GET /api/cvs/:userId/file
 */
export const getCvFileForN8n = async (req, res) => {
    try {
        const { userId } = req.params;
        const cvDoc = await cvService.getCvMetadataByUserId(userId);

        if (!cvDoc) {
            return res.status(404).json({
                success: false,
                message: "Not Found",
                error: "No CV file found for this userId.",
            });
        }

        res.setHeader("Content-Type", cvDoc.mimeType || "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(cvDoc.originalName)}"`);
        if (cvDoc.size) {
            res.setHeader("Content-Length", cvDoc.size);
        }

        const downloadStream = cvService.getCvDownloadStream(cvDoc.fileId);

        downloadStream.on("error", (error) => {
            console.error("GridFS n8n stream error:", error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error",
                    error: "Failed to stream PDF for n8n workflow.",
                });
            }
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error in getCvFileForN8n controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Controller: Delete CV file from GridFS and metadata collection
 * DELETE /api/cvs/:userId
 */
export const deleteCv = async (req, res) => {
    try {
        const { userId } = req.params;
        const deleted = await cvService.deleteCvByUserId(userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Not Found",
                error: "No CV document found to delete.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "CV file and metadata deleted successfully.",
            data: { userId },
        });
    } catch (error) {
        console.error("Error in deleteCv controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * Controller: Get CV metadata status
 * GET /api/cvs/:userId
 */
export const getCvStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const cvDoc = await cvService.getCvMetadataByUserId(userId);

        if (!cvDoc) {
            return res.status(404).json({
                success: false,
                message: "Not Found",
                error: "No CV record found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: cvDoc,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
