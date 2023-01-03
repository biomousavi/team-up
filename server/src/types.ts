import type { Socket } from 'socket.io';

export interface JoinPayload {
  name: string;
  email: string;
  meetId: string;
}
export interface NewMeetAck {
  meetId: string;
}

export interface ParticipantsPayload {
  count: number;
}

export interface JoinAck {
  status: 'ok' | 'error';
  message: string;
  // TODO:
}

export type MeetEvent = 'join' | 'left' | 'new-meet';

export interface MeetEvents {
  [key: string]: MeetEvent;
}

export interface SocketData {
  name?: string;
  email?: string;
}

export interface Meet {
  id: string;
}

export type ClientSocket = Socket<MeetEvents, MeetEvents, undefined, SocketData>;
