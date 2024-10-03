import { Socket } from 'socket.io';
import { MenuClientToServerEvents, MenuServerToClientEvents } from '../types/modules/menuSocketEvents';

export class MenuSocketService {
    constructor(private socket: Socket<MenuClientToServerEvents, MenuServerToClientEvents>) {
        this.initializeMenuEvents();
    }

    private initializeMenuEvents() {
        this.socket.on('menuAction', (action) => {
            console.log('Menu action received:', action);
            // Poprawna konstrukcja if
            if (action === "joinChat") {
                this.socket.emit('redirectToChat');
            }
        });
    }
    
}
