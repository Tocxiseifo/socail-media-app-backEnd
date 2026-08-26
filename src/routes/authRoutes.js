import { Router } from "express";
import { logIn, register } from "../controllers/authControllers.js";

export const authRoutes = Router()

authRoutes.post('/register' , register)
authRoutes.post('/login' , logIn)