import { auth } from "../lib/auth.js";
<<<<<<< HEAD
=======
import { fromNodeHeaders } from "better-auth/node";

>>>>>>> 90525170874bf82114ff0e60a532cde0614c93da

export const requireAdmin = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

<<<<<<< HEAD
    if (session.user.role?.toUpperCase() !== "ADMIN") {
=======
    if (session.user.role !== "ADMIN") {
>>>>>>> 90525170874bf82114ff0e60a532cde0614c93da
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
