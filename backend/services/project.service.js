import Project from "../models/project.model.js";

export const createProject = async ({ name, userId }) => {
    if (!name || !userId) {
        throw new Error("Please provide name and userId")
    }
    const project = await Project.create({ name, users: [userId] })
    return project
}

export const getAllProjectByUserId = async ({ userId }) => {
    if (!userId) {
        throw new Error("Please provide userId")
    }
    try {
        const projects = await Project.find({ users: userId })
        return projects
    } catch (error) {
        throw new Error(error.message)
    }
}

export const addUserToProjects = async ({ projectId, users, userId }) => {
    if (!projectId || !users) {
        throw new Error("Please provide projectId and users")
    }

    const project = await Project.findById({ _id: projectId, users: userId })

    if (!project) {
        throw new Error("Project not found")
    }

    const updatedProject = await Project.findOneAndUpdate({ _id: projectId }, {
        $addToSet: {
            users: {
                $each: users
            }
        }
    },
    {new: true})

    return updatedProject

    
}