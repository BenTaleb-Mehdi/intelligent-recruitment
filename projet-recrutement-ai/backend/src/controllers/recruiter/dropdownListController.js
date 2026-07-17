import * as dropdownListService from "../../services/dropdownListService.js";
import * as recruiterService from "../../services/recruiterService.js";

export const getDropdownLists = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const { type } = req.query;
        const items = await dropdownListService.getDropdownLists(recruiterId, type);
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        console.error("Error fetching dropdown lists:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const createDropdownItem = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const { type, value } = req.body;
        if (!type || !value) {
            return res.status(400).json({ success: false, error: "type and value are required" });
        }

        const recruiter = await recruiterService.getRecruiterById(recruiterId);
        if (!recruiter) {
            return res.status(404).json({ success: false, error: "Recruiter not found" });
        }

        const item = await dropdownListService.createDropdownItem(recruiterId, type, value);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ success: false, error: "This option already exists" });
        }
        console.error("Error creating dropdown item:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const updateDropdownItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = req.body;
        if (!value) {
            return res.status(400).json({ success: false, error: "value is required" });
        }

        const item = await dropdownListService.updateDropdownItem(id, value);
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ success: false, error: "This option already exists" });
        }
        console.error("Error updating dropdown item:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const deleteDropdownItem = async (req, res) => {
    try {
        const { id } = req.params;
        await dropdownListService.deleteDropdownItem(id);
        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting dropdown item:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const deleteAllByType = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const { type } = req.query;
        if (!type) {
            return res.status(400).json({ success: false, error: "type query parameter is required" });
        }
        await dropdownListService.deleteAllByType(recruiterId, type);
        res.status(200).json({ success: true, message: "Items deleted successfully" });
    } catch (error) {
        console.error("Error deleting dropdown items:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};
