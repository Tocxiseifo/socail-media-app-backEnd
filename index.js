//====================Imports===================
import express from 'express'
import 'dotenv/config'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import { authRoutes } from './src/routes/authRoutes.js'
import { postRoutes } from './src/routes/postRoutes.js'
import { userRoutes } from './src/routes/userRoutes.js'
import { notificationRoutes } from './src/routes/notificationRoutes.js'
import {createServer} from "http"
import { Server } from 'socket.io'
import { initIo } from './src/socket/socket.js'

//================Init server===================
const app = express()
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }))
dotenv.config()

//===================Init DataBase==============
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
const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true } }) //connect websocket
initIo(io) //this function made to any controller need to connect with websocket can call it anywhere

//===============run the server===============
const port = 3300
server.listen(port , () => {
  console.log(`Server is running on port ${port}`);
});
