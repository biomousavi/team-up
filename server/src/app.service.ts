import { nanoid } from 'nanoid';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JoinAck, JoinPayload, Meet, NewMeetAck, MeetEvent, User, SignalPayload } from './types';
import { WsException } from '@nestjs/websockets';
const meetsCache = new Map<string, Meet>();

@Injectable()
export class AppService {
  addUser(meetId: string, user: User) {
    const meet = meetsCache.get(meetId);

    if (meet) {
      meet.users.push(user);
      meetsCache.set(meetId, meet);
    }
  }

  removeUser(meetId: string, user: User) {
    const meet = meetsCache.get(meetId);

    if (meet) {
      const users = meet.users.filter((u) => u.id !== user.id);
      meet.users = users;
      meetsCache.set(meetId, meet);
    }
  }

  async join(client: Socket, payload: JoinPayload): Promise<JoinAck> {
    try {
      const { meetId, email, name } = payload;

      const user: User = { id: client.id, name, email };

      // if meet id was not valid
      if (!meetsCache.has(meetId)) {
        throw new WsException('Meet ID is not  Valid.');
      }

      // join client to meeting room
      await client.join(meetId);

      // informing other users of joining a new user
      client.to(payload.meetId).emit<MeetEvent>('join', user);

      // add user to cache
      this.addUser(meetId, user);

      // notify other users when someone left the room
      client.on('disconnect', () => {
        client.to(payload.meetId).emit<MeetEvent>('left', user);
        this.removeUser(meetId, user);
      });

      const users = meetsCache.get(meetId).users;
      return { status: 'ok', users };
    } catch (error) {
      let message = 'Something went wrong. ';
      if (error instanceof WsException) message = error.message;

      return { status: 'error', message };
    }
  }

  async handlePeerSignal(client: Socket, payload: SignalPayload): Promise<void> {
    const user: User = { id: client.id };
    const signalPayload: SignalPayload = { user, data: payload.data };
    client.to(payload.user.id).emit<MeetEvent>('signal', signalPayload);
  }

  async handlePeerInit(client: Socket, payload: User): Promise<void> {
    const user: User = { id: client.id };
    client.to(payload.id).emit<MeetEvent>('init-peer', user);
  }

  async createNewMeet(): Promise<NewMeetAck> {
    const meetId = `${nanoid(4)}-${nanoid(4)}`;
    meetsCache.set(meetId, { id: meetId, users: [] });

    return { meetId };
  }
}
