const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Bach l-serveur y-9ra fchier .env

const app = express();

// Middlewares basics
app.use(express.json()); // Bach Express y-fhem l-data f format JSON
app.use(cors());         // Bach React y-9der y-hder m3a Node.js mn ba3d

// Kood d l-Connexion m3a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 DB Connected Successfully to MongoDB Atlas!"))
  .catch(err => console.error("🚨 DB Connection Error: ", err));

// Rapor تجريبي (Sanity Check)
app.get('/', (req, res) => {
    res.send("Serveur Node.js Backend Khdam!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur running on port ${PORT}`));