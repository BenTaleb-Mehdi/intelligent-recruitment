import { Router } from "express";
import * as jobOfferController from "../../controllers/recruiter/jobOfferController.js";
import { protectDashboard } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/api/job-offers", jobOfferController.getAllJobOffers);
router.get("/api/job-offers/:id", jobOfferController.getJobOfferById);
router.get("/api/recruiters/:recruiterId/job-offers", jobOfferController.getJobOffersByRecruiter);
router.post("/api/job-offers", protectDashboard, jobOfferController.createJobOffer);
router.put("/api/job-offers/:id", protectDashboard, jobOfferController.updateJobOffer);
router.delete("/api/job-offers/:id", protectDashboard, jobOfferController.deleteJobOffer);
router.patch("/api/job-offers/:id/toggle-status", protectDashboard, jobOfferController.toggleStatus);
router.patch("/api/job-offers/description-webhook", jobOfferController.updateDescriptionFromWebhook);
router.post("/api/job-offers/:id/regenerate", protectDashboard, jobOfferController.regenerateJobOfferDescription);

export default router;
