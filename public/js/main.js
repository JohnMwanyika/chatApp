const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get user query and room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username, room);

const socket = io();

// Join chat
socket.emit("joinRoom", { username, room });

// message from the server
socket.on("message", (msg) => {
  console.log(msg);
  outputMessage(msg);

  // auto scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// leave room
socket.emit("leaveRoom", { username, room });
// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let msg = e.target.elements.msg.value;
  // emmiting msg to server
  socket.emit("chatMessage", msg);

  // clear the textbox
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// function to output users
function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
       ${msg.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// function to output room name
function outputRoomName(room) {
  roomName.innerText = room;
}
// function to output room users
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join()}
  `;
}
