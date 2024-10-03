import { Server, Socket } from 'socket.io';
import { ChatSocketService } from './ChatSocketService';
import { MenuSocketService } from './MenuSocketService';

export class SocketService {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.initializeSocketEvents();

    }

    private initializeSocketEvents() {
        this.io.on('connection', (socket: Socket) => {
            console.log('A user connected');

            
            // Initialize socket services
            new ChatSocketService(socket); 
            new MenuSocketService(socket); 
        
            // example events which work for every socket
            socket.on('test', (data) => {
                console.log('Test event received:', data);
                socket.emit('testResponse', 'Server got your message');
            });
            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        });
    }
}