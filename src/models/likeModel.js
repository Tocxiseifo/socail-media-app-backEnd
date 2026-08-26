import mongoose, { model, Schema } from 'mongoose'

const likeSchema = new Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})