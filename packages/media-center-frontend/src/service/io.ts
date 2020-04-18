import socketio from "socket.io-client";
import { API_ENDPOINT } from "../constants";

export const playerIo = socketio(`${API_ENDPOINT}player`);
