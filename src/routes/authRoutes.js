import { Router } from "express";
import { logIn, logOut, register } from "../controllers/authControllers.js";
import { verifyUser } from "../middleware/middlewares.js";

export const authRoutes = Router()

authRoutes.post('/register' , register)
authRoutes.post('/login' , logIn)
authRoutes.post('/logOut' , verifyUser , logOut)