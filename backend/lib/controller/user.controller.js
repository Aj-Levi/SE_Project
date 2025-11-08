import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "please fill out all the fields !! ", success: false })
        }


        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists . Use different email ", success: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        })
        return res.status(201).json({ message: 'Account Created successfully ', success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", success: false })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'please fill all the fields', success: false })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exists register first ", success: false })
        }
        const isvalidUser = await bcrypt.compare(password, user.password)
        if (!isvalidUser) {
            return res.status(400).json({ message: 'incorrect email or password ,try again !!' })
        }

        if (role != user.role) {
            return res.status(400).json({ message: 'Account does not exists with current role !!  ' })
        }
        const tokenData = {
            userID: user._id,
            role:user.role
        }
        user = {
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            contributions: user.contributions,
            score: user.score
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax',secure:false }).json({ message: `Welcome ${(user.name).toUpperCase()}`, success: true, user })

    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "logged out successfully", success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });


    }
}
export const gettop10=async(req,res)=>{
    try {
        const topUsers=await User.find()
        .sort({score:-1})
        .limit(5)
        .select("name score contributions");
        if (!topUsers || topUsers.length === 0) {
      return res.status(404).json({ message: "No users found", success: false });
    }

    return res.status(200).json({
      message: "Top 10 users fetched successfully",
      success: true,
      users: topUsers,
    });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}