import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();

const chatContainer = document.getElementById("chat__container");
const chatInput = document.getElementById("chat__input");
const chat = document.getElementById("chat");

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("user message", (message) => {
	
	renderMessage("You", message);

	// Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});


chatInput.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get message text
  const chatMsg = e.target.elements.chat.value;

  // emit message to server
  socket.emit('chatMessage', chatMsg)

  chat.value = "";
  renderMessage(chatMsg, false);
});

// output message to DOM
function renderMessage(message, isBotMessage) {
  const chatBubble = document.createElement("div");
  chatBubble.className = `chat__bubble chat__bubble--${
    isBotMessage ? "bot" : "user"
  }`;
  chatBubble.innerHTML = message;
  chatContainer.appendChild(chatBubble);

  // scroll down
  chatContainer.scrollTop = chatContainer.scrollHeight;
}


socket.on("options", (options) => {
  const optionsHtml = options
    .map((options) => `<ul><li>${options}</li></ul>`)
    .join("");
  renderMessage(optionsHtml, true);
});


// output message to DOM
socket.on("chat", (chat) => {
  console.log("chat", chat);

  const messageHtml = `<p>${chat}</p>`;

  renderMessage(messageHtml, true);
});
