import { notificationModel } from "../models/notificationModel.js"

export const getNotifications = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const page = Number(req.query.page) || 1
        const limit = Math.min(Number(req.query.limit) || 20 , 50) //we add the Math method here to prevent user to send more than 50
        const skip = (page - 1) * limit
        const getNotifications = await notificationModel.find({
            recipient:req.user._id
        }).populate('sender' , 'username displayName avatar').sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
        const totalNotification = await notificationModel.countDocuments({recipient:req.user._id})
        const totalPages = Math.ceil(totalNotification / limit)
        const notRead = await notificationModel.countDocuments({isRead:false , recipient:req.user._id})
        return res.status(200).json({msg:"user notification fetched successfully" , userNotification:getNotifications , pagination:{totalNotification:totalNotification , totalPages:totalPages , currantPage:page , unread:notRead}})
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