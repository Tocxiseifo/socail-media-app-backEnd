import { Router } from "express";
import { verifyUser } from "../middleware/middlewares.js";
import { getNotifications, markAllAsRead, markAsRead } from "../controllers/notificationController.js";

export const notificationRoutes = Router()

notificationRoutes.get('/' , verifyUser , getNotifications)
notificationRoutes.patch('/:notificationId/read' , verifyUser , markAsRead)
notificationRoutes.patch('/read-all' , verifyUser , markAllAsRead)