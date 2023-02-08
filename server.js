const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// function to format messages
const formartMessages = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";
// Run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    // user joining the room
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // welcome he current user
    socket.emit(
      "message",
      formartMessages(
        botName,
        `Hey ${user.username}, Welcome to cHaTcOrd ${user.room} room`
      )
    );
    //   Broadcast when a user connects sends to all users except self
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formartMessages(botName, `${user.username} has joined the chat`)
      );
  });

  // listen for chat msg
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    const currUser = getCurrentUser(socket.id);

    io.to(currUser.room).emit(
      "message",
      formartMessages(currUser.username, msg)
    );
  });

  // When user leaves the chat/closes connection
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formartMessages(botName, `${user.username} has left the chat`)
      );
    }
  });

  //   broadcasts to all users including self
  io.emit();
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
