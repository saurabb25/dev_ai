import express from "express"
import authController from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { body } from "express-validator"


const router = express.Router()

router.post("/register",
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 3 }).withMessage("Password must be at least 6 characters long"),
    authController.createUserController)


router.post("/login",
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 3 }).withMessage("Password must be at least 6 characters long"),
    authController.loginUserController
)
router.get("/profile", authMiddleware ,authController.profileController)

router.get("/getAllUsers", authMiddleware, authController.getAllUsers)


router.get("/logout", authController.logoutController)



export default router