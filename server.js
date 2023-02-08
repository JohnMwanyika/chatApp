const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", (socket) => {
  socket.emit("message", "Welcome to CHatCord");
  //   Broadcast when a user connects sends to all users except self
  socket.broadcast.emit("message", "A user has joined the chat");
  //   broadcasts to all users including self
  io.emit();

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  // listen for chat msg
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    io.emit("message", msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
