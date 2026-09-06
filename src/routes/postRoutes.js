import { Router } from "express";
import { verifyUser } from "../middleware/middlewares.js";
import { createPost, deletePost, editPost, getFeed, getPost } from "../controllers/postControllers.js";

export const postRoutes = Router()

postRoutes.post('/' , verifyUser , createPost)
postRoutes.get('/feed' , verifyUser , getFeed)
postRoutes.get('/:id' , verifyUser , getPost)
postRoutes.patch('/:id' , verifyUser , editPost)
postRoutes.delete('/:id' , verifyUser , deletePost)