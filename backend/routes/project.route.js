import express from "express"
import * as projectController from "../controllers/project.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { body } from "express-validator"

const router = express.Router()

router.post("/create",
    authMiddleware,
    body("name").isString().withMessage("Please provide a valid name"),
    projectController.createProject
)

router.get("/all",
    authMiddleware,
    projectController.getAllProjects
)

router.put("/add-user",
    authMiddleware,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
    .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),

    projectController.addUser
)

router.get("/get-all-project/:projectId",
    authMiddleware,
    projectController.getProjectById
)

export default router