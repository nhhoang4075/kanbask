const express = require('express'); // Import Express
const next = require('next'); // Import Next.js
const { Server } = require('socket.io'); // Import Socket.IO
const http = require('http'); // Import HTTP module

const port = parseInt(process.env.PORT, 10) || 3000; // Define the port
const dev = process.env.NODE_ENV !== 'production'; // Check if in development mode
const app = next({ dev }); // Initialize Next.js app
const handle = app.getRequestHandler(); // Get Next.js request handler

let server; // Declare the server variable for later use

app.prepare().then(() => {
    const serverApp = express(); // Create an Express server
    server = http.createServer(serverApp); // Create an HTTP server using Express
    const io = new Server(server, {
        cors: {
            origin: "*", // Allow all origins for CORS
            methods: ["GET", "POST", "PUT"], // Allow GET, POST, and PUT methods
        },
    }); // Initialize Socket.IO

    // Set up Socket.IO event listeners
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });

        // Listen for the "join" event to join a specific conversation room
        socket.on("join", (conversationId) => {
            console.log(`Client ${socket.id} joined conversation:`, conversationId);
            socket.join(conversationId);
        });

        // Listen for the "leave" event to leave a specific conversation room
        socket.on("leave", (conversationId) => {
            console.log(`Client ${socket.id} left conversation:`, conversationId);
            socket.leave(conversationId);
        });
    
        // Listen for the "new-message" event to handle new messages
        socket.on("new-message", (message) => {
            console.log("New message received:", message);
            // Emit the new message to all clients in the conversation
            socket.to(message.conversationId).emit("received-message", message);
        });

        // Listen for the "update-message" event to handle message updates
        socket.on("update-message", ({ messageId, changes, conversationId }) => {
            console.log(`Message ${messageId} updated with changes:`, changes);
            // Emit the updated message to all clients in the conversation
            socket.to(conversationId).emit("updated-message", { messageId, changes });
        });

        // Listen for the "delete-message" event to handle message deletions
        socket.on("delete-message", ({ message }) => {
            console.log(`Message ${message} deleted`);
            // Emit the deleted message to all clients in the conversation
            socket.to(message.conversationId).emit("deleted-message", message.id);
        });
    });

    // Handle all other routes with Next.js
    serverApp.all('*name', (req, res) => {
        return handle(req, res);
    });

    // Start the server
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});

// Graceful shutdown
const shutdown = () => {
    console.log("\nShutting down server...");
    if (server) {
        server.close(() => {
            console.log("Server closed. Port 3000 is now free.");
            process.exit(0); // Exit the process
        });
    } else {
        process.exit(0); // Exit immediately if the server is not initialized
    }
};

// Listen for termination signals
process.on('SIGINT', shutdown); // Handle Ctrl+C
process.on('SIGTERM', shutdown); // Handle termination signals (e.g., from Docker or Kubernetes)