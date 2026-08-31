import dotenv from 'dotenv'; 
import mongoose from 'mongoose';
dotenv.config();
const URI = process.env.MONGO_URI;

async function testConnection() {
    try {
        console.log("⏳ Connecting to MongoDB Atlas using dotenv...");
        
        if (!URI) {
            throw new Error("Le lien MONGO_URI est introuvable f l-fichiy .env !");
        }
        
        await mongoose.connect(URI);
        console.log("🍃 ✅ Connection successful !!");
        
        await mongoose.connection.close();
        console.log("The connection is closed");
        
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:");
        console.error(error.message);
    }
}

testConnection();