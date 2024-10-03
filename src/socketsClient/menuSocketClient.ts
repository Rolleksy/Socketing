import { io, Socket } from 'socket.io-client';

// IInitialize socket
const socket: Socket = io();

// DOM elements
const joinChatButton = document.getElementById("joinChatButton") as HTMLButtonElement | null;

// Checking if all elements are found
if (!joinChatButton) {
    console.error("Join Chat button not found");
} else {
    joinChatButton.addEventListener("click", () => {
        socket.emit("menuAction", "joinChat");
    });

    
    socket.on('redirectToChat', () => {
        location.assign('/chat') // redirect to chat page
    });
}
