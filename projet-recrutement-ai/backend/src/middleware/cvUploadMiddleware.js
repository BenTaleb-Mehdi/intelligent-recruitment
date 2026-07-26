import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isPdfMime = file.mimetype === "application/pdf" || file.mimetype === "application/x-pdf";
    const isPdfExt = ext === ".pdf";

    if (isPdfExt || isPdfMime) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF (.pdf) files are allowed."), false);
    }
};

export const cvMulter = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB limit
    },
});

export const handleCvUploadMiddleware = (req, res, next) => {
    const uploadSingle = cvMulter.single("cv");
    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "File size limit exceeded",
                    error: "CV file size cannot exceed 20 MB.",
                });
            }
            return res.status(400).json({
                success: false,
                message: "Multer upload error",
                error: err.message,
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid file upload",
                error: err.message,
            });
        }
        next();
    });
};
