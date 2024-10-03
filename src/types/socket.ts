import { ChatServerToClientEvents, ChatClientToServerEvents, ChatInterServerEvents, ChatSocketData } from './modules/chatSocketEvents';
import { MenuServerToClientEvents, MenuClientToServerEvents, MenuInterServerEvents, MenuSocketData } from './modules/menuSocketEvents';

// Extending types for socket types
export interface ServerToClientEvents extends ChatServerToClientEvents, MenuServerToClientEvents /* otherFeatureServerToClientEvents */ {};
export interface ClientToServerEvents extends ChatClientToServerEvents, MenuClientToServerEvents {};
export interface InterServerEvents extends ChatInterServerEvents, MenuInterServerEvents {};

// Extending types for socket data
export interface SocketData extends ChatSocketData, MenuSocketData {};
