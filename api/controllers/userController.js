import cloudinary from "../config/cloudinary.js"
import User from "../models/User.js"


export const updateProfile = async (req, res) => {
    try {
        const {image, ...data} = req.body

        let updatedData = data

        if (image) {
            if(image.startsWith("data:image")) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image)
                    updatedData.image = uploadResponse.secure_url
                } catch (error) {
                    console.log("Error uploading image: ", error)
                    return res.status(500).json({message: "Error uploading image"})
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, {new: true})

        res.status(200).json({
            success: true,
            user: updatedUser
        })
            
    } catch (error) {
        console.log("Error in updateProfile controller: ", error)
        res.status(500).json({message: "Internal server error"})
    }
}