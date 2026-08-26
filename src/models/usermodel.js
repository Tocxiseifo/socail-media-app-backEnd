import { model, Schema } from 'mongoose'

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    displayName:{
        type:String,
        required:true
    },
    avatar:{
        type:Number,
    },
    following:{
        type:Number,
        default:0
    },
    followers:{  
        type:Number,
        default:0
    },
    refreshToken:{
        type:String 
    }
},{timestamps:true})

export const userModel = model("user" , userSchema)