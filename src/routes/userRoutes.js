import { Router } from "express";
import { verifyUser } from "../middleware/middlewares.js";
import { editUser, getAllPosts, getUser } from "../controllers/userControllers.js";

export const userRoutes = Router()


userRoutes.patch('/me' , verifyUser , editUser)
userRoutes.get('/:username' , verifyUser , getUser)
userRoutes.get('/:username/post' , verifyUser , getAllPosts)