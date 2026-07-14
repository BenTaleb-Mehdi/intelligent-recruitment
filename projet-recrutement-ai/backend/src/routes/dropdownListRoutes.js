import { Router } from "express";
import * as dropdownListController from "../controllers/dropdownListController.js";
import { protectDashboard } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/api/dropdown-lists/:recruiterId", protectDashboard, dropdownListController.getDropdownLists);
router.post("/api/dropdown-lists/:recruiterId", protectDashboard, dropdownListController.createDropdownItem);
router.put("/api/dropdown-lists/:id", protectDashboard, dropdownListController.updateDropdownItem);
router.delete("/api/dropdown-lists/:id", protectDashboard, dropdownListController.deleteDropdownItem);
router.delete("/api/dropdown-lists/:recruiterId/type", protectDashboard, dropdownListController.deleteAllByType);

export default router;
