import { commentModel } from "../models/commentModel.js"
import { likeModel } from "../models/likeModel.js"
import { postModel } from "../models/postmodel.js"

export const createPost = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:'unauthorized'})
        }
        const {author , content , Image} = req.body
        const createPost = await postModel.create({author , content , Image})
        return res.status(201).json({msg:"post created successfully" , post:createPost})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getFeed = async (req , res) => {
    try {
        const getAllFeed = await postModel.find().sort({ createdAt: -1 }).lean()
        if (getAllFeed.length === 0) {
            return res.status(400).json({msg:'no feeds found'})
        }
        return res.status(200).json({msg:"feeds fetched successfully"})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getPost = async (req , res) => {
    try {
        const {id} = req.params
        const getPostById = await postModel.findById(id)
        if (!getPostById) {
            return res.status(400).json({msg:"couldn't find this user"})
        }
        return res.status(200).json({msg:"post fetched successfully" , post:getPostById})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const editPost = async (req , res) => {
    try{
        const {content , Image} = req.body
        const {id} = req.params 
        const getPostById = await postModel.findByIdAndUpdate(id , {content , Image} , {new:true})
        if (!getPostById) {
            return res.status(400).json({msg:"couldn't find this user"})
        }
        return res.status(200).json({msg:"post edited successfully" , editedPost:getPostById})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const deletePost = async (req , res) => {
    try{
        const {id} = req.params 
        const getPostById = await postModel.findByIdAndDelete(id)
        if (!getPostById) {
            return res.status(400).json({msg:"couldn't find this user"})
        }
        return res.status(200).json({msg:"post deleted successfully" , deletedPost:getPostById})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const createLike = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:'unauthorized'})
        }
        const {id} = req.params
        const post = await postModel.findById(id)
        const getLike = await likeModel.findOne({
            user:req.user._id ,
            post:post._id
        })
        if (getLike) {
            return res.status(404).json({msg:"user already liked this post"})
        }
        const like = await likeModel.create({
            user:req.user._id,
            post:post._id
        })
        post.likeCount += 1 
        await post.save();
        res.status(201).json({msg:"you like this post" , Like:like}) 
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const deleteLike = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:'unauthorized'})
        }
        const {id} = req.params
        const post = await postModel.findById(id)
        const getLike = await likeModel.findOne({
            user:req.user._id ,
            post:post._id
        })
        if (getLike) {
            return res.status(404).json({msg:"user already like this post"})
        }
        const removeLike = await likeModel.findByIdAndDelete(getLike)
        post.likeCount -=1  
        await post.save();
        res.status(200).json({msg:"you like this post" , Like:removeLike}) 
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const createComment = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:'unauthorized'})
        }
        const {id} = req.params
        const {content} = req.body
        const post = await postModel.findById(id)
        if (!post) {
            return res.status(404).json({msg:"couldn't find this post"})
        }
        const createComment = await commentModel.crete({
            post:post._id,
            author:req.user._id,
            content:content
        })
        post.commentCount += 1
        await post.save()
        res.status(201).json({msg:"comment added successfully" , comment:createComment})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getComment = async (req , res) => {
    try {
        const getAllComment = await commentModel.find()
        if (getAllComment.length === 0) {
            return res.states(404).json({msg:"no comments found"})
        }
        res.status(201).json({msg:"comment fetched successfully" , comment:getAllComment})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const editComment = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:'unauthorized'})
        }
        const {id} = req.params
        const {content} = req.body
        const post = await postModel.findById(id)
        if (!post) {
            return res.status(404).json({msg:"couldn't find this post"})
        }
        const editComment = await commentModel.findByIdAndUpdate(id , {content})
        res.status(200).json({msg:"comment edited successfully" , editedComment:editComment})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const deleteComment = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:'unauthorized'})
        }
        const {id} = req.params
        const post = await postModel.findById(id)
        if (!post) {
            return res.status(404).json({msg:"couldn't find this post"})
        }
        const deleteComment = await commentModel.findByIdAndDelete(id)
        post.commentCount -= 1
        await post.save()
        res.status(201).json({msg:"comment deleted successfully" , deletedComment:deleteComment})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}