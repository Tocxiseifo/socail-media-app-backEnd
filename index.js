//====================Imports===================
import express from 'express'
import 'dotenv/config'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { authRoutes } from './src/routes/authRoutes.js'
import { postRoutes } from './src/routes/postRoutes.js'
import { userRoutes } from './src/routes/userRoutes.js'
import { notificationRoutes } from './src/routes/notificationRoutes.js'
const app = express()
app.use(express.json());

dotenv.config()

const DatabaseUrl = process.env.MONGODB_URL
mongoose.connect(DatabaseUrl)
.then(() => console.log("✅ MongoDB Connected..."))
.catch(err => console.log("❌ MongoDB Connection Error:", err));


//===============routes===========================
app.use('/api/auth' , authRoutes)
app.use('/api/users' , userRoutes)
app.use('/api/posts' , postRoutes)
app.use('/api/notifications' , notificationRoutes)

//=====================server=====================
const port = 3300
app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
});