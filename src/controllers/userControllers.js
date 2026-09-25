import { followModel } from "../models/followModel.js"
import { notificationModel } from "../models/notificationModel.js"
import { postModel } from "../models/postmodel.js"
import { userModel } from "../models/usermodel.js"

//====================fetch user data=====================
export const getUser = async (req , res) => {
    try {
        const {username} = req.params
        const findUser = await userModel.findOne({username}).select('-password  -refreshToken')
        if (!findUser) {
            return res.status(404).json({msg:"couldn't find this user"})
        }
        return res.status(200).json({msg:"user fetched successfully" ,user:findUser})   
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

//====================edit user data=====================
export const editUser = async (req , res) => {
    try {
        const id = req.params.me
        if (!req.user) {
            return res.status(401).json({msg:"unauthorized"})
        }
        const {username , displayName , bio } = req.body
        const editUser = await userModel.findByIdAndUpdate(id , {username , displayName , bio } , {new:true})
        if (!editUser) {
            return res.status(400).json({msg:"couldn't find this user"})
        }
        res.status(200).json({msg:"user data updated successfully" , newUserData:editUser})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

//====================fetch all user posts=====================
export const getAllPosts = async (req , res) => {
    try {
        const {username} = req.params
        const findUser = await userModel.findById(username)
        if (!findUser) {
            return res.status(404).json({msg:"couldn't find this user"})
        }
        const getUserPost = await postModel.find({author:findUser._id}).sort({ createdAt: -1 }).lean()
        if (getUserPost.length === 0) {
            return res.status(404).json({msg:"couldn't find user"})
        }
        return res.status(200).json({msg:"user posts fetched successfully" , userPosts:getUserPost})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

//====================fetch user followers=====================
export const getFollowers = async (req , res) => {
    try {
        if (!req.user._id) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const {id} = req.params
        const getFollowers = await userModel.findById(id).select('followers').sort({ createdAt: -1 }).lean()
        if (!getFollowers) {
            return res.status(404).json({msg:"couldn't find this user"})
        }
        return res.status(200).json({msg:"user followers fetched successfully" , userFollowers:getFollowers})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

//====================fetch my posts function=====================
export const getMyPosts = async (req , res) => {
    try {
        const getMyPosts = await postModel.find({author:req.user._id}).sort({ createdAt: -1 }).lean()
        if (getMyPosts.length === 0) {
            return res.status(404).json({msg:"couldn't find your posts"})
        }
        return res.status(200).json({msg:"user posts fetched successfully" , myPosts:getMyPosts})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}


//====================follow user function=====================
export const followUser = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const {id} = req.params
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                msg: "You can't follow yourself"
            })
        }
        const fetchUser = await userModel.findById(id)
        if (!fetchUser) {
            return res.status(404).json({msg:"couldn't find this user"})
        }
        const existingFollow = await followModel.findOne({
            follower:req.user._id,
            following:id
        })
        if (existingFollow) {
            return res.status(409).json({
                msg: "You already follow this user"
            })
        }
        await followModel.create({
            follower:req.user._id,
            following:id
        })
        const fetchFollower = await userModel.findById(req.user._id)
        if (!fetchFollower) {
            return res.status(409).json({msg:"user is already follow you"})
        }
        fetchFollower.following++
        fetchUser.followers++
        await fetchUser.save()
        await fetchFollower.save()
        const notification = await notificationModel.create({recipient:id , sender:req.user._id , type:"follow" , targetId:id ,isRead:false})
        return res.status(201).json({msg:"user follow successfully" , followUser:fetchUser})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

//====================fetch all user following=====================
export const getUserFollowing = async (req , res) => {
    try {
        if (!req.user._id) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const {id} = req.params
        const fetchUser = await userModel.findById(id).select('following').sort({ createdAt: -1 }).lean()
        if (!fetchUser) {
            return res.status(404).json({msg:"couldn't find this user"})
        }
        return res.status(404).json({msg:"user following fetched successfully" , userFollowing:fetchUser})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

//====================delete following=====================
export const deleteFollow = async (req , res) => {
    try {
        if (!req.user._id) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const {id} = req.params
        const existingFollow = await followModel.findOne({
            follower:req.user._id,
            following:id
        })
        if (!existingFollow) {
            return res.status(404).json({msg:"user already unfollowed"})
        }
        const deleteFollow = await followModel.findOneAndDelete({
            follower:req.user._id,
            following:id
        })
        const fetchUser = await userModel.findById(req.user._id)
        const fetchFollowing = await userModel.findById(id)
        fetchUser.following--
        fetchFollowing.followers--
        await fetchUser.save()
        await fetchFollowing.save()
        return res.status(200).json({msg:"user remove following successfully" , removeFollow:deleteFollow})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}