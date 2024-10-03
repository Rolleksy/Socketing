import { io, Socket } from 'socket.io-client';

// Initialize socket
const socket: Socket = io();

// DOM elements
const sendButton = document.getElementById("sendButton") as HTMLButtonElement | null;
const messageInput = document.getElementById("messageInput") as HTMLInputElement | null;
const messagesList = document.getElementById("messagesList") as HTMLUListElement | null;

// Checking if all elements are found
if (!sendButton || !messageInput || !messagesList) {
    console.error("One or more DOM elements not found");
} else {
    // Sending message
    sendButton.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit("sendMessage", message); 
            messageInput.value = '';
        }
    });

    // Receiving message
    socket.on("broadcastMessage", (message: string) => {
        const newMessage = document.createElement("li");
        newMessage.textContent = message; 
        messagesList.appendChild(newMessage);
    });
}
