import mongoose, { model, Schema } from 'mongoose'

const commentSchema = new Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true})

export const commentModel = model('comment' , commentSchema)