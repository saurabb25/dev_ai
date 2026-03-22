import Project from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";
import User from "../models/user.model.js";


export const createProject = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {name} = req.body
    const loggedinUser = await User.findOne({email: req.user.email})
    if(!loggedinUser){
        return res.status(400).json({message: "User not found"})
    }

    try {
        const project = await projectService.createProject({name, userId: loggedinUser._id})
        res.status(201).json(project)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const getAllProjects = async(req, res) => {
    try {
        // const projects = await Project.find({users: req.user._id}).populate('users')
        // res.status(200).json(projects)

        const loggedInUser = await User.findOne({email: req.user.email})
        if(!loggedInUser){
            return res.status(400).json({message: "User not found"})
        }

        const allUserProjects = await projectService.getAllProjectByUserId({userId: loggedInUser._id})
        return res.status(200).json(allUserProjects)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const addUser = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const {projectId, users} = req.body
        const loggedinUser = await User.findOne({email: req.user.email})

        const updatedProject = await projectService.addUserToProjects({projectId, users, userId: loggedinUser._id})
        res.status(200).json(updatedProject)

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const getProjectById = async(req, res) => {
    try {
        const project = await Project.findOne({_id: req.params.projectId}).populate('users')
        res.status(200).json(project)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}