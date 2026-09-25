import { Router } from "express";
import { verifyUser } from "../middleware/middlewares.js";
import { createComment, createLike, createPost, deleteComment, deleteLike, deletePost, editComment, editPost, getComment, getFeed, getPost } from "../controllers/postControllers.js";

export const postRoutes = Router()

postRoutes.post('/' , verifyUser , createPost)
postRoutes.get('/:id' , verifyUser , getPost)
postRoutes.patch('/:id' , verifyUser , editPost)
postRoutes.delete('/:id' , verifyUser , deletePost)
postRoutes.post('/like/:id' , verifyUser , createLike)
postRoutes.delete('/like/:id' , verifyUser , deleteLike)
postRoutes.post('/comment/:id' , verifyUser , createComment)
postRoutes.get('/comment' , verifyUser , getComment)
postRoutes.patch('/comment/:id' , verifyUser , editComment)
postRoutes.delete('/comment/:id' , verifyUser , deleteComment)
postRoutes.get('/feed' , verifyUser , getFeed)