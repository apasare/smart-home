import socketio from "socket.io-client";
import { API_HOST } from "../constants";

export const playerIo = socketio(`${API_HOST}player`);
