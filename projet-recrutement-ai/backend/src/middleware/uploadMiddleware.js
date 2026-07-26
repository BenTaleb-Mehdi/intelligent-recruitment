// Legacy middleware re-exporting memory storage for GridFS (no disk storage used)
export { cvMulter as uploadCvMiddleware, handleCvUploadMiddleware } from "./cvUploadMiddleware.js";
