import { io } from 'socket.io-client';
import { useMeetStore } from './stores/meet';
import { useUserStore } from './stores/user';

import type { ReservedEvent, MeetEvent, User, SignalPayload } from './types';

const socket = io(import.meta.env.VITE_SERVER_URL, {
  path: '/socket',
  autoConnect: false,
  reconnection: true,
});

// update connection state on connect to server
socket.on<ReservedEvent>('connect', () => {
  const user = useUserStore();
  const meet = useMeetStore();

  user.id = socket.id;
  meet.alertMessage = null;
});

// catch connection error event, when server is down
socket.on<ReservedEvent>('connect_error', (error) => {
  const meet = useMeetStore();
  meet.alertMessage = "ERR_CONNECTION_REFUSED: We can't connect to server.";
  console.log(error);
});

socket.on<MeetEvent>('join', (payload: User) => {
  const meet = useMeetStore();
  meet.addUser(payload);
  meet.initPeer(payload);
  meet.createPeerConn(payload, false);
});

socket.on<MeetEvent>('signal', (payload: SignalPayload) => {
  const meet = useMeetStore();
  meet.handlePeerSignal(payload);
});

socket.on<MeetEvent>('init-peer', (payload: User) => {
  const meet = useMeetStore();
  meet.createPeerConn(payload, true);
});

socket.on<MeetEvent>('left', (payload: User) => {
  const meet = useMeetStore();
  meet.removeUser(payload.id);
});

export default socket;
