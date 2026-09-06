import { postModel } from "../models/postmodel.js"
import { userModel } from "../models/usermodel.js"

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