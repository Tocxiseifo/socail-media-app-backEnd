import jwt from "jsonwebtoken"
import { userModel } from "../models/usermodel.js"
import bcrypt from 'bcrypt'

export const register = async (req , res) => {
    try {
        const {email , username , displayName , password} = req.body
        const user = await userModel.findOne({email , username , displayName})
        if (user) {
            return res.status(404).json({msg:"this email or userName or displayName is used already"})
        }
        const hashPassword = bcrypt.hash(password , 10)  

        const newUser = await userModel.create({email , username , displayName , password:hashPassword})
        const token = jwt.sign({id:newUser._id} , process.env.JWT_SECRET_KEY , {expiresIn:'1d'})
        return res.status(201).json({msg:"user made successfully" , user:{id:newUser._id , userName:username} , token})
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const logIn = async (req , res) => {
    try {
        const {email , password} = req.body
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(400).json({msg:"email or password is wrong"})
        }
        const comperePassword = bcrypt.compare(password , user.password)
        if (comperePassword) {
            const accessToken = jwt.sign({id:user_id} , process.env.JWT_SECRET_KEY , {expiresIn:'1d'})
            const refreshToken = jwt.sign({id:user_id} , process.env.JWT_SECRET_KEY , {expiresIn:'30d'})
            user.refreshToken = refreshToken
            await user.save()
            return res.status(200).json({user:{id:user._id ,username:findUser.username  , email:user.email} , accessToken , refreshToken,  msg:"user login successfully"})
        }else{
            return res.status(400).json({msg:'wrong email or password !'})   
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
}