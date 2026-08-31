import * as recruiterService from "../../services/recruiterService.js";

export const getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await recruiterService.getAllRecruiters();
        res.status(200).json({ success: true, data: recruiters });
    } catch (error) {
        console.error("Error fetching recruiters:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const getRecruiterById = async (req, res) => {
    try {
        const recruiter = await recruiterService.getRecruiterById(req.params.id);
        if (!recruiter) {
            return res.status(404).json({ success: false, error: "Recruiter not found" });
        }
        res.status(200).json({ success: true, data: recruiter });
    } catch (error) {
        console.error("Error fetching recruiter:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const createRecruiter = async (req, res) => {
    try {
        const { userId, companyName, website, industry, teamSize, headquarters, description, logo, iceNumber, rcNumber } = req.body;
        if (!userId || !companyName) {
            return res.status(400).json({ success: false, error: "userId and companyName are required" });
        }

        const existing = await recruiterService.getRecruiterByUserId(userId);
        if (existing) {
            return res.status(409).json({ success: false, error: "Recruiter already exists for this user" });
        }

        const recruiter = await recruiterService.createRecruiter({
            userId, companyName, website, industry, teamSize, headquarters, description, logo, iceNumber, rcNumber,
        });
        res.status(201).json({ success: true, data: recruiter });
    } catch (error) {
        console.error("Error creating recruiter:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const updateRecruiter = async (req, res) => {
    try {
        const recruiter = await recruiterService.getRecruiterById(req.params.id);
        if (!recruiter) {
            return res.status(404).json({ success: false, error: "Recruiter not found" });
        }

        const { companyName, website, industry, teamSize, headquarters, description, logo, iceNumber, rcNumber, contractTypes, locations, experienceLevels } = req.body;
        
        const targetCompanyName = companyName !== undefined ? companyName : recruiter.companyName;
        const targetIceNumber = iceNumber !== undefined ? iceNumber : recruiter.iceNumber;
        const targetRcNumber = rcNumber !== undefined ? rcNumber : recruiter.rcNumber;

        // Detect if ICE or RC actually changed
        const iceChanged = iceNumber !== undefined && iceNumber !== recruiter.iceNumber;
        const rcChanged = rcNumber !== undefined && rcNumber !== recruiter.rcNumber;
        const shouldReVerify = (iceChanged || rcChanged) && targetCompanyName && (targetIceNumber || targetRcNumber);

        let verificationStatus = recruiter.verificationStatus || "UNVERIFIED";
        let isProfileComplete = recruiter.isProfileComplete || false;
        let verificationMessage = "";

        // Only re-verify when ICE or RC has actually changed
        if (shouldReVerify) {
            const webhookUrl = process.env.N8N_VERIFY_COMPANY_WEBHOOK_URL || "https://n8n.iksatech.com/webhook/verify-company-search";
            const webhookPayload = {
                recruiterId: recruiter.id,
                companyName: targetCompanyName,
                iceNumber: targetIceNumber || null,
                rcNumber: targetRcNumber || null,
            };

            try {
                const response = await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(webhookPayload),
                });

                const webhookResult = await response.json().catch(() => null);

                let isVerified = false;
                if (webhookResult && webhookResult.isVerified === true) {
                    isVerified = true;
                    verificationMessage = webhookResult.message || "Company verified successfully by n8n.";
                } else {
                    isVerified = false;
                    verificationMessage = webhookResult?.message || "Verification failed: ICE or RC not found on Charika.ma.";
                }

                verificationStatus = isVerified ? "VERIFIED" : "REJECTED";
                isProfileComplete = isVerified;
            } catch (fetchErr) {
                console.error("Auto verification error on save:", fetchErr);
            }
        }

        const updateData = {
            ...(companyName !== undefined && { companyName }),
            ...(website !== undefined && { website }),
            ...(industry !== undefined && { industry }),
            ...(teamSize !== undefined && { teamSize }),
            ...(headquarters !== undefined && { headquarters }),
            ...(description !== undefined && { description }),
            ...(logo !== undefined && { logo }),
            ...(iceNumber !== undefined && { iceNumber }),
            ...(rcNumber !== undefined && { rcNumber }),
            ...(contractTypes !== undefined && { contractTypes }),
            ...(locations !== undefined && { locations }),
            ...(experienceLevels !== undefined && { experienceLevels }),
            verificationStatus,
            isProfileComplete,
        };

        const updated = await recruiterService.updateVerificationStatus(req.params.id, updateData);
        res.status(200).json({ 
            success: true, 
            data: updated,
            verificationStatus,
            isVerified: verificationStatus === "VERIFIED",
            canCreateOffer: verificationStatus === "VERIFIED",
            message: verificationMessage || (verificationStatus === "VERIFIED" 
                ? "Profile saved and company verified successfully!" 
                : "Profile updated successfully.")
        });
    } catch (error) {
        console.error("Error updating recruiter:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

export const deleteRecruiter = async (req, res) => {
    try {
        const recruiter = await recruiterService.getRecruiterById(req.params.id);
        if (!recruiter) {
            return res.status(404).json({ success: false, error: "Recruiter not found" });
        }

        await recruiterService.deleteRecruiter(req.params.id);
        res.status(200).json({ success: true, message: "Recruiter deleted successfully" });
    } catch (error) {
        console.error("Error deleting recruiter:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

/**
 * Endpoint A: POST /api/recruiters/verify-company
 * Verifies company ICE or RC number by calling an external n8n webhook (Charika.ma integration)
 * and updates recruiter verification status in MySQL database.
 */
export const verifyCompany = async (req, res) => {
    try {
        const { companyName, iceNumber, rcNumber } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Missing authenticated user token.",
            });
        }

        if (!companyName || (!iceNumber && !rcNumber)) {
            return res.status(400).json({
                success: false,
                message: "companyName and at least one identification number (iceNumber or rcNumber) are required.",
            });
        }

        // 1. Get or create recruiter profile for authenticated user
        let recruiter = await recruiterService.getRecruiterByUserId(userId);
        if (!recruiter) {
            recruiter = await recruiterService.createRecruiter({
                userId,
                companyName,
                iceNumber,
                rcNumber,
            });
        }

        // 2. Call external n8n webhook
        const webhookUrl = process.env.N8N_VERIFY_COMPANY_WEBHOOK_URL || "https://n8n.iksatech.com/webhook/verify-company-search";

        const webhookPayload = {
            recruiterId: recruiter.id,
            companyName,
            iceNumber: iceNumber || null,
            rcNumber: rcNumber || null,
        };

        let webhookResult = null;
        let isVerified = false;
        let webhookMessage = "";

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(webhookPayload),
            });

            webhookResult = await response.json().catch(() => null);

            if (webhookResult && webhookResult.isVerified === true) {
                isVerified = true;
                webhookMessage = webhookResult.message || "Company verified successfully by n8n.";
            } else {
                isVerified = false;
                webhookMessage = webhookResult?.message || "Verification failed: ICE or RC not found on Charika.ma.";
            }
        } catch (fetchError) {
            console.error("Error connecting to n8n verification webhook:", fetchError);
            return res.status(502).json({
                success: false,
                message: "Failed to connect to external verification service. Please try again later.",
                error: fetchError.message,
            });
        }

        // 3. Update database according to verification outcome
        const updatedStatus = isVerified ? "VERIFIED" : "REJECTED";
        const updatedRecruiter = await recruiterService.updateVerificationStatus(recruiter.id, {
            verificationStatus: updatedStatus,
            isProfileComplete: isVerified,
            companyName,
            iceNumber,
            rcNumber,
        });

        // 4. Return exact verification status to frontend
        if (isVerified) {
            return res.status(200).json({
                success: true,
                isVerified: true,
                canCreateOffer: true,
                status: "VERIFIED",
                message: webhookMessage,
                recruiter: updatedRecruiter,
            });
        } else {
            return res.status(403).json({
                success: false,
                isVerified: false,
                canCreateOffer: false,
                status: "REJECTED",
                message: webhookMessage,
                recruiter: updatedRecruiter,
            });
        }
    } catch (error) {
        console.error("Error during company verification:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred while processing company verification.",
            error: error.message,
        });
    }
};

