import User from "../models/user.model.js";
import * as userService from "../services/user.service.js"
import { validationResult } from "express-validator";
// import redisClient from "../services/redis.service.js"

const createUserController = async(req, res) =>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
    try {
        const user = await userService.createUser(req.body)
        const token = await User.generateJWT()
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const loginUserController = async(req, res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const {email, password} = req.body
        const user = await User.findOne({email}).select('+password')

        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        const isValidPassword = await user.isValidPassword(password)

        if(!isValidPassword){
            return res.status(401).json({message: "Invalid password"})
        }

        const token = await user.generateJWT()
        res.status(200).json({user,token})

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const profileController = async(req,res) => {
    res.status(200).json(req.user)
}

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const logoutController = async(req,res) => {
    try {      
        const token = req.headers.authorisation
        // await redisClient.set(token, "logout")       
        res.status(200).json({message: "Logout successful"})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const authController = {
    createUserController,
    loginUserController,
    profileController,
    logoutController,
    getAllUsers
};

export default authController;