import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  reconnection: true,
  path: "/",
});

export default socket;
