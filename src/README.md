# Proof of concept 
**socket.io, express-handlebars, compiled ts with types, webpack, socketService for server-side events**

## Project structure just as an example, sorry for non-uniform naming convention 

## server.ts

### Server setup:
```ts
const app = express();
const httpServer = createServer(app);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
```

### Static folder setup - for css and ts files compiled to js
```ts
app.use(express.static(path.join(__dirname, '/public')));
```

### Initializing server-side Socket.IO with typed events
```ts
const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer);
```
typing events esures data adheres to specific structure and allows IDE support (suggestions and autocompletn)


### Initializing SocketService
```ts
const socketServerService = new SocketService(io);
```
The initialization of the socketServerService instance allows the application to leverage the functionality defined in the SocketService class. This instance will manage all features socket interactions (SERVER-SIDE), ensuring that the event handling logic is centralized and organized. By doing so, we create a scalable architecture that can adapt as the application grows and evolves.


### Views routing
```ts
app.get('/chat', (req, res) => {
  res.render('chat');
});

app.get('/menu', (req, res) => {
  res.render('menu');
});
```
It could or even should be changed, for now it works like that. **Open to suggestions**


## Webpack - `webpack.config.js`

As far as I understand:

We define files in `*.ts` which are to be compiled to `*.js` for browser to use. Browser cannot use plain TS files so we are using `ts-loader`. For now either entry paths and output paths are temporary, and definetely **open to suggestions**, as how to store files. 

```js
const path = require('path');

module.exports = {
    entry: {
        chat: './src/socketsClient/chatSocketClient.ts',
        menu: './src/socketsClient/menuSocketClient.ts',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'src/public/js'),
        publicPath: '/js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    mode: 'development'
};
```

As above: 
We define `entry` with multiple clientSocket logic files with a name such as `chat: './src/socketsClient/chatSocketClient.ts',`. Then on output we define compiled filename as `[name].bundle.js` on selected path.

Right now to compile whole project I was using `tsc` command, and the `npm start` as its in `package.json`

## Handlebars

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Socket.IO Chat</title>
     <script src="/js/chat.bundle.js" defer></script>
     <script src="socket.io/socket.io.js"></script>
</head>
<body>
    <h1>Chat Room</h1>
    <input id="messageInput" type="text" placeholder="Type your message here..." />
    <button id="sendButton">Send</button>
    <ul id="messagesList"></ul>
</body>
</html>
```

In handlebars file we attach to scripts. One is for logic: `/js/chat.bundle.js` and second one for socket.io-client logic

## Event Types


`chatSocketEvents.ts`

```ts
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
```

Example of how to type events for chat feature, as written above typing events esures data adheres to specific structure and allows IDE support (suggestions and autocompletn)

It is then combined in `socket.ts` file with other types for other features:
```ts
import { ChatServerToClientEvents, ChatClientToServerEvents, ChatInterServerEvents, ChatSocketData } from './modules/chatSocketEvents';
import { MenuServerToClientEvents, MenuClientToServerEvents, MenuInterServerEvents, MenuSocketData } from './modules/menuSocketEvents';

// Extending types for socket types
export interface ServerToClientEvents extends ChatServerToClientEvents, MenuServerToClientEvents /* otherFeatureServerToClientEvents */ {};
export interface ClientToServerEvents extends ChatClientToServerEvents, MenuClientToServerEvents {};
export interface InterServerEvents extends ChatInterServerEvents, MenuInterServerEvents {};

// Extending types for socket data
export interface SocketData extends ChatSocketData, MenuSocketData {};
```

Combining them allows us to import just one Events file to server, with all feature events in it.

It also has to be passed into `FeatureSocketService.ts`.


## SocketService - Server-side

This implementation allows us to have seperate `SocketService` for each feature, for example:

```ts 
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
```

This is logic of SERVER-SIDE events for chat feature and as you can see it takes `<ChatClientToServerEvents, ChatServerToClientEvents>` types as mentioned before.

So explaining a bit more:
If you add:
```ts
this.socket.on("doSomething", ()=>{})
```
IDE will highlight it, because its not defined in `chatSocketEvents.ts`



Finally every FeatureSocketService is combined in `socketsServerService.ts`:
```ts
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
```

And also `socket.on('test' ...)` is enabled on all sockets! Feature specific are initialized by `new FeatureSocketService(socket)`



## Pre-compiled Client-side logic in `*.ts` files

These files consist of CLIENT-SIDE logic for sockets and are compiled to, for now I assume, `/src/public/js/` folder. For how it's compiled and why that folder/name look at `webpack.config.js` or Webpack chapter above.


```ts
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
```






