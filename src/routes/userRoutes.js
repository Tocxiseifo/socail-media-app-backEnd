import { Router } from "express";
import { verifyUser } from "../middleware/middlewares.js";
import { deleteFollow, editUser, followUser, getAllPosts, getFollowers, getUser, getUserFollowing } from "../controllers/userControllers.js";

export const userRoutes = Router()


userRoutes.get('/:username' , verifyUser , getUser)
userRoutes.get('/:username/post' , verifyUser , getAllPosts)
userRoutes.get('/:id/followers' , verifyUser , getFollowers)
userRoutes.get('/:id/following' , verifyUser , getUserFollowing)
userRoutes.post('/:id/follow' , verifyUser , followUser)
userRoutes.delete('/:id/follow' , verifyUser , deleteFollow)
userRoutes.patch('/me' , verifyUser , editUser)