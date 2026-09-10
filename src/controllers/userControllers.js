import { notificationModel } from "../models/notificationModel.js"
import { postModel } from "../models/postmodel.js"
import { userModel } from "../models/usermodel.js"
import { getNotifications } from "./notificationController.js"

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
        const findUser = await postModel.findById(username).sort({ createdAt: -1 }).lean()
        if (!findUser) {
            return res.status(404).json({msg:"couldn't find this user"})
        }
        return res.status(200).json({msg:"user posts fetched successfully" , userPosts:findUser})
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

//====================follow user function=====================
export const followUser = async (req , res) => {
    try {
        if (!req.user) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const {id} = req.params
        const fetchUser = await userModel.findById(id)
        if (!fetchUser) {
            return res.status(404).json({msg:"couldn't find this user"})
        }
        fetchUser.followers++
        await fetchUser.save()
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
        if (!req.user) {
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
        if (!req.user) {
            return res.status(401).json({msg:"unAuthorized"})
        }
        const {id} = req.params
        const deleteFollow = await userModel.findByIdAndUpdate(id , {$pull:{followers:id}} , {new:true})
        await userModel.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }, { new: true } );
        return res.status(200).json({msg:"user remove following successfully" , removeFollow:deleteFollow})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}