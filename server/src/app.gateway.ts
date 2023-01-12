import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import { JoinAck, JoinPayload, MeetEvent, NewMeetAck, SignalPayload, User } from './types';

@WebSocketGateway({ cors: { origin: '*' }, serveClient: false, path: '/socket' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private appService: AppService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage<MeetEvent>('join')
  joinTheMeet(client: Socket, payload: JoinPayload): Promise<JoinAck> {
    return this.appService.join(client, payload);
  }
  @SubscribeMessage<MeetEvent>('left')
  leftTheMeet(client: Socket, payload: string): Promise<void> {
    return this.appService.left(client, payload);
  }

  @SubscribeMessage<MeetEvent>('new-meet')
  createNewMeet(): Promise<NewMeetAck> {
    return this.appService.createNewMeet();
  }

  @SubscribeMessage<MeetEvent>('signal')
  handlePeerSignal(client: Socket, payload: SignalPayload): Promise<void> {
    return this.appService.handlePeerSignal(client, payload);
  }
  @SubscribeMessage<MeetEvent>('init-peer')
  handlePeerInit(client: Socket, payload: User): Promise<void> {
    return this.appService.handlePeerInit(client, payload);
  }

  handleDisconnect(client: Socket) {
    console.log(client.id, ' disconnected');
  }

  handleConnection(client: Socket) {
    console.log(client.id, ' connected');
  }
}
