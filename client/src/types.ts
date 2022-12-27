export interface JoinPayload {
  roomId: string;
}
export interface CodeChangedPayload {
  roomId: string;
  changes: any;
  selection: any;
}

export interface ParticipantsPayload {
  count: number;
}

export interface JoinAck {
  status: 'ok' | 'error';
  changes?: any;
  roomId?: string;
}

export enum RoomEvents {
  JOIN = 'join',
  PARTICIPANTS = 'participants',
  CODE_CHANGED = 'code_changed',
  CODE_CHANGES = 'code_changes',
}
