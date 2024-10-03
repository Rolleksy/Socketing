export interface ChatServerToClientEvents {
    broadcastMessage: (message: string) => void;
}

export interface ChatClientToServerEvents {
    sendMessage: (message: string) => void;
}

export interface ChatInterServerEvents {
    // example events from documentation
    ping: () => void; 
}

export interface ChatSocketData {
    // example data from documentation
    name: string;
    age: number;
}
