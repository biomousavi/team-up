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
  meet.connected = true;
});

// catch connection error event
// when server is down
socket.on('connect_error', () => {
  const meet = useMeetStore();
  meet.connected = false;
});
export default socket;
