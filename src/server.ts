import express from 'express';
import { createServer } from 'http';
import { engine } from 'express-handlebars';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

// Importing SocketService class from '/socketsServer/socketsServerService.ts' file
// Its sort of managing class for all socket services - SERVER SIDE LOGIC
import { SocketService } from './socketsServer/socketsServerService';
// Import types from '/types/socket.ts' file
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './types/socket';

const app = express();
const httpServer = createServer(app);

// Setting up handlebars as view engine for express
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Setting static files for express - public folder which contains css, js files compiled from ts
app.use(express.static(path.join(__dirname, '/public')));

// Initialize socket.io server with types from '/types/socket.ts' file
const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer);

const socketServerService = new SocketService(io);


// Views routing
app.get('/chat', (req, res) => {
  res.render('chat');
});

app.get('/menu', (req, res) => {
  res.render('menu');
});


const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
