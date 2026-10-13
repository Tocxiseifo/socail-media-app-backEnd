import { verifySocketUser } from "../middleware/socketMiddleware.js"

let ioSocket = null
export const onlineUser = new Map() //we use map method here to save both of socketId and userId

export const initIo = (io) => {
    ioSocket = io
    ioSocket.use(verifySocketUser) 

    //===============connect to socket.io============
    ioSocket.on('connection', (socket) => {
        const userId = socket.user._id
        const socketId = socket.id
        onlineUser.set(userId.toString(), socketId)
        socket.on('disconnect' , () =>{
            onlineUser.delete(userId)    
        })
    });
}

export const getIo = () =>{
    if (ioSocket === null) {
       throw new Error("the io is not completed")
    }
    return ioSocket
}