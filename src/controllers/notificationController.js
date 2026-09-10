import { notificationModel } from "../models/notificationModel.js"

export const getNotifications = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const getNotifications = await notificationModel.find({
            recipient:req.user._id
        }).sort({ createdAt: -1 }).lean()
        return res.status(200).json({msg:"user notification fetched successfully" , userNotification:getNotifications})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const markAsRead = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const id = req.params.notificationId
        const updateNotification = await notificationModel.findOneAndUpdate({
            _id:id,
            recipient:req.user._id
        } , {isRead:true} , {new:true})
        if (!updateNotification) {
            return res.status(404).json({msg: "notification not found"})
        }
        return res.status(200).json({msg:"notification state updated successfully" , updated:updateNotification})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const markAllAsRead = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const updateAll = await notificationModel.updateMany({
            recipient:req.user._id,
            isRead:false
        },{isRead:true} )
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}