import type { SignalData } from 'simple-peer';

export interface User {
  id: string;
  name?: string;
  email?: string;
  signalData?: SignalData;
  mediaId?: string; // to track which mediaStream is for which user
  mediaStream?: MediaStream;
}

export interface Message {
  user: User;
  text: string;
  meetId: string;
}

export interface SignalPayload {
  user: User;
  data: SignalData;
}

export interface JoinPayload {
  name: string;
  email: string;
  meetId?: string;
  mediaId?: string; // to track which mediaStream is for which user
  signalData?: SignalData;
}

export interface NewMeetAck {
  meetId: string;
}

export interface ParticipantsPayload {
  count: number;
}

export interface JoinAck {
  status: 'ok' | 'error';
  message?: string;
  users?: User[];
}

export type ReservedEvent =
  | 'connect'
  | 'connect_error'
  | 'disconnect'
  | 'disconnecting'
  | 'newListener'
  | 'removeListener';

export type MeetEvent = 'join' | 'left' | 'new-meet' | 'signal' | 'init-peer' | 'message';

export interface Meet {
  id: string;
  users: User[];
}
