import express from "express"
import dotenv from "dotenv"
dotenv.config()

import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import connectDB from "./config/database.js"
connectDB()

const app = express()



app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))


import authRouter from "./routes/user.route.js"
app.use("/user", authRouter)

import projectRouter from "./routes/project.route.js"
app.use("/project", projectRouter)


export default app