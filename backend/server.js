import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import Project from "./models/project.model.js";

import app from "./app.js";

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server);

// only the authenticated user can connect with the server other users will not be able to connect
io.use(async (socket, next) => {
    try {
        // on the basis of token i can identify the user
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
        const projectId = socket.handshake.query.projectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }
        socket.project = await Project.findById(projectId);
        if (!token) {
            return next(new Error("Authentication error"))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return next(new Error("Authentication error"))
        }
        socket.user = decoded
        next()


    } catch (error) {
        next(error)
    }
})

io.on("connection", (socket) => {

    // jaise hi socket connect hoga with the help of websocket kis particular project par connect kar dega
    // socket.join(socket.project._id.toString());
    socket.roomId = socket.project._id.toString()
    console.log("Client connected:");





    socket.on("project-message", async (data) => {
        const message = data.message;

        const aiIsPresentInMessage = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('project-message', data)

        if (aiIsPresentInMessage) {
            const prompt = message.replace('@ai', '');
            const result = await generateResult(prompt);
            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: 'ai',
                    email: 'AI'
                }
            })
            return
        }
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        socket.leave(socket.roomId)
    });
});

// Port setup with fallback
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});