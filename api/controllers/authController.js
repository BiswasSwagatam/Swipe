import User from "../models/User.js"
import jwt from "jsonwebtoken"


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

export const signup = async (req, res) => {
    
    const { username, email, password, age, gender, genderPreference } = req.body
    
    try {
        if(!username || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        if (age < 18) {
            return res.status(400).json({ message: "You must be at least 18 years old" })
        }
        
        const newUser = await User.create({ 
            username, 
            email, 
            password, 
            age, 
            gender, 
            genderPreference 
        })

        const token = signToken(newUser._id)

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        })

        res.status(201).json({
            success: true,
            user: newUser
        })

    } catch (error) {
        console.log("Error in signup controller: ", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    
}

export const logout = async (req, res) => {
    
}