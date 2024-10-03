import { Socket } from 'socket.io';
import { ChatClientToServerEvents, ChatServerToClientEvents } from '../types/modules/chatSocketEvents';

export class ChatSocketService {
    constructor(private socket: Socket<ChatClientToServerEvents, ChatServerToClientEvents>) {
        this.initializeChatEvents();
    }

    private initializeChatEvents() {
        this.socket.on('sendMessage', (msg) => {
            this.socket.emit('broadcastMessage', msg); // Emits message to the user who sent it
            this.socket.broadcast.emit('broadcastMessage', msg); // Emits message to all users except the one who sent it
        });
    }
}