import * as cvService from "../services/cvService.js";

/**
 * Controller: Upload CV file to MongoDB GridFS
 */
export const uploadCv = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Upload failed",
                error: "No PDF file provided.",
            });
        }

        const userId = req.user.id;
        const cvDoc = await cvService.uploadCvToGridFS(userId, req.file);

        return res.status(200).json({
            success: true,
            message: "CV uploaded successfully to MongoDB GridFS",
            data: {
                id: cvDoc._id,
                userId: cvDoc.userId,
                fileId: cvDoc.fileId,
                originalName: cvDoc.originalName,
                mimeType: cvDoc.mimeType,
                size: cvDoc.size,
                status: cvDoc.status,
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
            message: "Failed to upload CV to MongoDB GridFS",
            error: error.message,
        });
    }
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
                message: "CV not found",
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
                    message: "Error streaming file from GridFS",
                    error: error.message,
                });
            }
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error in downloadCv controller:", error);
        return res.status(500).json({
            success: false,
            message: "Error downloading CV",
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
                message: "CV not found",
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
                    message: "Error streaming file from GridFS",
                    error: error.message,
                });
            }
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error in viewCv controller:", error);
        return res.status(500).json({
            success: false,
            message: "Error viewing CV",
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
                message: "CV not found for n8n workflow",
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
                    message: "Failed to stream PDF for n8n",
                    error: error.message,
                });
            }
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error in getCvFileForN8n controller:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching CV file for n8n",
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
                message: "CV not found",
                error: "No CV document found to delete.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "CV file and metadata deleted successfully from MongoDB GridFS",
            data: { userId },
        });
    } catch (error) {
        console.error("Error in deleteCv controller:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting CV",
            error: error.message,
        });
    }
};

/**
 * Controller: Get CV metadata details
 * GET /api/cvs/:userId
 */
export const getCvStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const cvDoc = await cvService.getCvMetadataByUserId(userId);

        if (!cvDoc) {
            return res.status(404).json({
                success: false,
                message: "CV metadata not found",
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
            message: "Error fetching CV status",
            error: error.message,
        });
    }
};
