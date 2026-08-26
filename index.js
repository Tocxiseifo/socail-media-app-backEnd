//====================Imports===================
import express from 'express'
import 'dotenv/config'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()
const app = express()

const DatabaseUrl = process.env.MONGODB_URL
mongoose.connect(DatabaseUrl)
.then(() => console.log("✅ MongoDB Connected..."))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

//=====================server=====================
const port = 3000
app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
});