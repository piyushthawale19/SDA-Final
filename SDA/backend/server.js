import "dotenv/config";
import http from "http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";

import app from "./app.js";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";
import { handleGitHubCommand } from "./services/github.service.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

// JWT + Project validation middleware for Socket.IO
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers.authorization &&
        socket.handshake.headers.authorization.split(" ")[1]);

    if (!token) {
      return next(new Error("Authentication error: Token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;

    const projectId = socket.handshake.query.projectId;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid or missing projectId"));
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
      return next(new Error("Project not found"));
    }
    socket.project = project;

    next();
  } catch (error) {
    console.error("Socket auth error:", error.message);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socket.join(socket.project._id.toString());
  console.log(`User connected to project room: ${socket.project._id}`);

  socket.on("project-message", async (data) => {
    try {
      const message = data.message || "";
      socket.broadcast.to(socket.project._id.toString()).emit("project-message", data);

      // Handle @ai commands
      if (message.toLowerCase().includes("@ai")) {
        const prompt = message.replace(/@ai/gi, "").trim();
        const result = await generateResult(prompt);
        io.to(socket.project._id.toString()).emit("project-message", {
          message: result.toString(),
          sender: { _id: "ai", email: "AI" },
        });
      }

      // Handle @github commands
      if (message.toLowerCase().includes("@github")) {
        const command = message.replace(/@github/gi, "").trim();
        const currentProject = await projectModel.findById(socket.project._id);
        const result = await handleGitHubCommand(command, currentProject);
        io.to(socket.project._id.toString()).emit("project-message", {
          message: JSON.stringify(result),
          sender: { _id: "github", email: "GitHub" },
        });
      }
    } catch (err) {
      console.error("Socket message error:", err.message);

      // Determine which service had the error
      const isGitHubError = data?.message?.toLowerCase().includes("@github");
      io.to(socket.project._id.toString()).emit("project-message", {
        message: JSON.stringify({
          text: `${isGitHubError ? "GitHub" : "AI"} processing error: ${err.message}`,
          type: "error"
        }),
        sender: { _id: isGitHubError ? "github" : "ai", email: isGitHubError ? "GitHub" : "AI" },
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    socket.leave(socket.project._id.toString());
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
