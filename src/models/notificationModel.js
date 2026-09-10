import mongoose, { model, Schema } from "mongoose";

const NotificationSchema = new Schema({
    recipient :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    isRead:{
        type:Boolean,
        required:true,
        default:false
    },
    targetId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    type:{
        type:String,
        enum:["follow" , "like" , "comment"],
        required:true
    }
},{timestamps:true})

export const notificationModel = model('notification' , NotificationSchema)