import { Router } from "express";
import * as cvController from "../controllers/cvController.js";
import { requireAuth, authorizeCvAccess } from "../middleware/cvAuthMiddleware.js";
import { handleCvUploadMiddleware } from "../middleware/cvUploadMiddleware.js";

const router = Router();

// Upload CV PDF to GridFS
router.post("/api/cvs/upload", requireAuth, handleCvUploadMiddleware, cvController.uploadCv);

// Download PDF attachment
router.get("/api/cvs/:userId/download", requireAuth, authorizeCvAccess, cvController.downloadCv);

// View PDF inline in browser
router.get("/api/cvs/:userId/view", requireAuth, authorizeCvAccess, cvController.viewCv);

// n8n Workflow Direct Stream Endpoint
router.get("/api/cvs/:userId/file", requireAuth, authorizeCvAccess, cvController.getCvFileForN8n);

// Get CV Metadata status
router.get("/api/cvs/:userId", requireAuth, authorizeCvAccess, cvController.getCvStatus);

// Delete CV from GridFS and DB
router.delete("/api/cvs/:userId", requireAuth, authorizeCvAccess, cvController.deleteCv);

export default router;
