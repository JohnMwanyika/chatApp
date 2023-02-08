const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

// message from the server
socket.on('message',msg=>{
    console.log(msg)
    outputMessage(msg)

    // auto scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    let msg = e.target.elements.msg.value;
    // emmiting msg to server
    socket.emit('chatMessage',msg)

    // clear the textbox
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputMessage(msg){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
       ${msg}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}