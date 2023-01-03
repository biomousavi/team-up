import { nanoid } from 'nanoid';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JoinAck, JoinPayload, ClientSocket, Meet, NewMeetAck } from './types';
import { WsException } from '@nestjs/websockets';
const meetsCache = new Map<string, Meet>();

// https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters
@Injectable()
export class AppService {
  async join(server: Server, client: ClientSocket, payload: JoinPayload): Promise<JoinAck> {
    try {
      console.log(payload);

      client.data.name = payload.name;
      client.data.email = payload.email;

      // if meet id was not valid
      if (!meetsCache.has(payload.meetId)) {
        throw new WsException('Meet ID is not Valid.');
      }

      // join client to meeting room
      await client.join(payload.meetId);

      // inform other memebers that someone joined the meet

      // client.data.

      // const ack: JoinAck = {
      //   status: 'ok',
      //   roomId: payload.roomId,
      // };

      // if (payload.roomId === 'new') {
      //   // create new room id
      //   payload.roomId = nanoid.nanoid(6);

      //   // update ack roomId
      //   ack.roomId = payload.roomId;
      // }

      // // check if changes exists
      // if (changes.has(payload.roomId)) {
      //   ack.changes = changes.get(payload.roomId);
      // }

      // // join the user to room
      // await client.join(payload.roomId);

      // // update participants
      // await this.updateParticipants(server, payload.roomId);

      // // update participants on disconnect
      // client.on('disconnect', () => this.updateParticipants(server, payload.roomId));

      // return ack;
      // return { status: 'error', meetId: 'sdsd' };
    } catch (error) {
      let message = 'Something went wrong.';

      if (error instanceof WsException) message = error.message;

      return { status: 'error', message };
    }
  }

  async updateParticipants(server: Server, roomId: string): Promise<void> {
    // // get the room participants
    // const sockets = await server.in(roomId).fetchSockets();
    // // extract the length of sockets
    // const payload: ParticipantsPayload = { count: sockets.length };
    // // fire participants event
    // server.in(roomId).emit(RoomEvents.PARTICIPANTS, payload);
  }

  async createNewMeet(client: Socket): Promise<NewMeetAck> {
    // cache changes
    // changes.set(payload.roomId, payload);
    // // send the code changes to other participants
    // client.broadcast.in(payload.roomId).emit(RoomEvents.CODE_CHANGES, payload);

    const meetId = `${nanoid(4)}-${nanoid(4)}`;
    meetsCache.set(meetId, { id: meetId });

    return { meetId };
  }
}
