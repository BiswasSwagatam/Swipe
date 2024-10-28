import Message from "../models/Message.js"

export const sendMessage = async (req, res) => {
    try {
        const {content, receiverId} = req.body
        const newMessage = await Message.create({
            senderId: req.user._id,
            receiver: receiverId,
            content
        })

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
                {senderId: userId, receiver: req.user._id},
                {senderId: req.user._id, receiver: userId}
            ]
        }).sort('createdAt')

        res.status(200).json({success: true, messages})
    } catch (error) {
        console.log("Error in getConversations controller: ", error)
        res.status(500).json({message: "Internal server error"})
    }
}