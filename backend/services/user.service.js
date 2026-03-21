import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


export const createUser = async({email, password})=>{
    if(!email || !password){
        throw new Error("Please provide email and password")
    }

    const hashedPassword = await User.hashPassword(password)

    const userData = await User.create({
        email,
        password: hashedPassword
    })

    return userData
}


const userService = {
    createUser
}

export default userService
