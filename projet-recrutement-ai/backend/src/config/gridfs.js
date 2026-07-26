import mongoose from "mongoose";

let cvBucket;

/**
 * Get or initialize the GridFS bucket for CV PDFs
 */
export const getCvBucket = () => {
    if (!cvBucket) {
        if (!mongoose.connection || !mongoose.connection.db) {
            throw new Error("MongoDB connection is not ready. Ensure connectMongo() has finished.");
        }
        cvBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "cvs",
        });
    }
    return cvBucket;
};
