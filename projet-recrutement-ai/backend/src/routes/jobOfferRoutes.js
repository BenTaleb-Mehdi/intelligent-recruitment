import { Router } from "express";
import * as jobOfferController from "../controllers/jobOfferController.js";
import { protectDashboard } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/api/job-offers", jobOfferController.getAllJobOffers);
router.get("/api/job-offers/:id", jobOfferController.getJobOfferById);
router.get("/api/recruiters/:recruiterId/job-offers", jobOfferController.getJobOffersByRecruiter);
router.post("/api/job-offers", protectDashboard, jobOfferController.createJobOffer);
router.put("/api/job-offers/:id", protectDashboard, jobOfferController.updateJobOffer);
router.delete("/api/job-offers/:id", protectDashboard, jobOfferController.deleteJobOffer);
router.patch("/api/job-offers/:id/toggle-status", protectDashboard, jobOfferController.toggleStatus);

export default router;
