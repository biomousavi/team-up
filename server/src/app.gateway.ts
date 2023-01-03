import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import { JoinAck, JoinPayload, MeetEvent, NewMeetAck } from './types';

@WebSocketGateway({ cors: { origin: '*' }, serveClient: false, path: '/' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private appService: AppService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage<MeetEvent>('join')
  joinTheMeet(client: Socket, payload: JoinPayload): Promise<JoinAck> {
    return this.appService.join(this.server, client, payload);
  }

  @SubscribeMessage<MeetEvent>('new-meet')
  createNewMeet(client: Socket): Promise<NewMeetAck> {
    return this.appService.createNewMeet(client);
  }

  handleDisconnect(client: Socket) {
    console.log('a client connected');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('a client disconnected');
  }
}
