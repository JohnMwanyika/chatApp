const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

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
socket.emit('leaveRoom',{username,room})
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

function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
       ${msg.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
