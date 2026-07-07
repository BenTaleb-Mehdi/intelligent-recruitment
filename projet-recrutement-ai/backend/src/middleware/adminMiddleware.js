import { auth } from "../lib/auth.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (session.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying admin session",
      error: error.message,
    });
  }
};
