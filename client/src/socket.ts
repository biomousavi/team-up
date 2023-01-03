import { io } from 'socket.io-client';
import { useMeetStore } from './stores/meet';

const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  reconnection: true,
  path: '/',
});

// update connection state on connect to server
socket.on('connect', () => {
  const meet = useMeetStore();
  meet.alertMessage = null;
});

// catch connection error event
// when server is down
socket.on('connect_error', () => {
  const meet = useMeetStore();
  meet.alertMessage = "ERR_CONNECTION_REFUSED: We can't connect to server.";
});
export default socket;
