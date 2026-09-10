import jwt from "jsonwebtoken"
import { userModel } from "../models/usermodel.js"

export const verifyUser = async(req , res , next) =>{
    const headerValue = req.headers['authorization']
    if (!headerValue) {
        req.user = null
        return res.status(401).json({msg:"missing invalid"})
    }
    if (!headerValue.startsWith('Bearer ')) {
        return res.status(401).json({msg:"error in syntext of token"})        
    }
    const token = headerValue.spilt(' ')[1]
    if (!token) {
        res.user = null
        return res.status(401).json({msg:"your token is invalid"})
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.status(404).json({msg:"user not found"})            
        }
        req.user = user
        next()
    } catch (error) {
        req.user = null; 
        res.status(401).json({msg:"Token invalid"});        
    }
}