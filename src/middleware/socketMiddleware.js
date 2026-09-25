import jwt from 'jsonwebtoken'
import { userModel } from '../models/usermodel.js'

export const verifySocketUser = async (socket , next) => {
    const headerValue = socket.handshake.headers['authorization']
    if (!headerValue) {
        socket.user = null
       return next(new Error("Authentication failed"))
    }
    if (!headerValue.startsWith('Bearer ')) {
        return next(new Error("stop token is filed"))
    }
    const token = headerValue.split(' ')[1]
    if (!token) {
        socket.user = null
        return next(new Error("stop token is filed"))
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
        const userToken = await userModel.findById(decoded.id)
        if (!userToken) {
            return next(new Error("user not found"))
        }
        socket.user = userToken
        next()
    } catch (error) {
        socket.user = null; 
        return next(new Error("Token invalid"))
    }
}