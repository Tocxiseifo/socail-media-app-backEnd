import { model, Schema } from 'mongoose'

const postSchema = new Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    content:{
        type:String,
        required:true
    },
    Image:{
        type:[String]
    },
    commentCount:{
        type:Number,
        default:0
    },
    likeCount:{
        type:Number,
        default:0
    }
},{timestamps:true})

export const postModel = model('post' , postSchema)