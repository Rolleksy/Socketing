export interface MenuServerToClientEvents {
    // example events from documentation
    noArg: () => void;
    basicEmit: (a: number, b: number, c: Buffer) => void;
    withAck: (d: string, callback: (e:number) => void) => void;

    // custom events
    redirectToChat: () => void;
}

export interface MenuClientToServerEvents {
    // example events from documentation
    hello: () => void;
    
    // custom events
    alertJoiningChat: () => void;
    menuAction: (action: "joinChat") => void;
}

export interface MenuInterServerEvents {
    // example events from documentation
    ping: () => void;
}

export interface MenuSocketData { 
    // example data from documentation
    name: string;
    age: number;
}