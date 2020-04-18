import socketio from "socket.io-client";
import { API_ENDPOINT } from "../constants";

export const io = socketio(`${API_ENDPOINT}player`);
