import http from "http";
import { Server } from "socket.io";

import app from "./app.js";

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server);

io.use((socket, next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
})

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Port setup with fallback
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});