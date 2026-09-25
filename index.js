//====================Imports===================
import express from 'express'
import 'dotenv/config'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { authRoutes } from './src/routes/authRoutes.js'
import { postRoutes } from './src/routes/postRoutes.js'
import { userRoutes } from './src/routes/userRoutes.js'
import { notificationRoutes } from './src/routes/notificationRoutes.js'
import {createServer} from "http"
import { Server, Socket } from 'socket.io'
import { verifySocketUser } from './src/middleware/socketMiddleware.js'
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
const server  =  createServer(app) //createserver() and make the value for it the app we made from express to make websocket

const io = new Server(server) //connect websocket
io.use(verifySocketUser)
io.on('connection', (socket) => {
    console.log(socket.id , socket.user)
  console.log('A user connected');
});
const port = 3300
server.listen(port , () => {
    console.log(`Server is running on port ${port}`);
});