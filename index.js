//====================Imports===================
import express from 'express'
import 'dotenv/config'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { authRoutes } from './src/routes/authRoutes.js'
import { postRoutes } from './src/routes/postRoutes.js'
import { userRoutes } from './src/routes/userRoutes.js'

dotenv.config()
const app = express()

const DatabaseUrl = process.env.MONGODB_URL
mongoose.connect(DatabaseUrl)
.then(() => console.log("✅ MongoDB Connected..."))
.catch(err => console.log("❌ MongoDB Connection Error:", err));


//===============routes===========================
app.use('/api/auth' , authRoutes)
app.use('/api/users' , userRoutes)
app.use('/api/posts' , postRoutes)

//=====================server=====================
const port = 3000
app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
});