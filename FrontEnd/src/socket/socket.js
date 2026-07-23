import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const socket = io(API_BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;