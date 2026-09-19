import mongoose, { model, Schema } from "mongoose";

const followSchema = new Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
        unique:true
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
        unique:true
    }
},{timestamps:true})


followSchema.index(
    {
        follower:1,
        following:1
    },{
        unique:true
    }
)
export const followModel = model('follow' , followSchema)