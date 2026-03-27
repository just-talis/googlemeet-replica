const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const PORT = 8000;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", () => {
    users[socket.id] = socket.id;
    socket.emit("your-id", socket.id);
  });

  socket.on("call-user", (data) => {
    io.to(data.to).emit("call-made", {
      signal: data.signal,
      from: data.from,
    });
  });

  socket.on("answer-call", (data) => {
    io.to(data.to).emit("call-accepted", data.signal);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

server.listen(PORT, () => console.log("Server running on port " + PORT));
