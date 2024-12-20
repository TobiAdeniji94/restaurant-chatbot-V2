import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();

const chatContainer = document.getElementById("chat-container");
const chatInput = document.getElementById("chat-input");
const chat = document.getElementById("chat");

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("user message", (message) => {
	renderMessage("You", message);
});

chatInput.addEventListener("submit", function (e) {
  e.preventDefault();

  // get message text
  const chatMsg = e.target.elements.chat.value;

  // don't send empty messages
  if (chatMsg === "") {
    return;
  }

  // emit message to server
  socket.emit('chatMessage', chatMsg)

  chat.value = "";
  renderMessage(chatMsg, false); // render user message
});

// output message to DOM
function renderMessage(message, isBotMessage) {
  const chatBubble = document.createElement("div");
  chatBubble.className = `chat-bubble chat-bubble--${isBotMessage ? "bot" : "user"}`;
  chatBubble.innerHTML = message;
  if (chatContainer) {
    chatContainer.appendChild(chatBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}


// output options to DOM
socket.on("options", (options) => {
  const optionsHtml = options
    .map((option) => `<ul><li>${option}</li></ul>`)
    .join("");
  renderMessage(optionsHtml, true);
});

// output welcome message to DOM
socket.on("welcome", (welcome) =>{
  const welcomeHTML = welcome;
  renderMessage(welcomeHTML, true);
})

// output user message to DOM
socket.on("chat", (message) => {
  const messageHtml = `<p>${message}</p>`;
  renderMessage(messageHtml, true);
});

