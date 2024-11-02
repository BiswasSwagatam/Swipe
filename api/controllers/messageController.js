import Message from "../models/Message.js"
import { getconnectedUsers, getIO } from "../socket/socket.server.js"

export const sendMessage = async (req, res) => {
    try {
        const {content, receiverId} = req.body
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        })

        const io = getIO()
        const connectedUsers = getconnectedUsers()
        const receiverSocketId = connectedUsers.get(receiverId)

        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                message: newMessage
            })
        }

        res.status(200).json({success: true, message: newMessage})
    } catch (error) {
        console.log("Error in sendMessage controller: ", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const getConversations = async (req, res) => {
    const {userId} = req.params
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
				{ sender: userId, receiver: req.user._id },
            ]
        }).sort('createdAt')

        res.status(200).json({
            success: true,
            messages
        })
    } catch (error) {
        console.log("Error in getConversations controller: ", error)
        res.status(500).json({message: "Internal server error"})
    }
}