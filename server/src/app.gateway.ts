import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';
import { JoinAck, JoinPayload, MeetEvent, Message, NewMeetAck, SignalPayload, User } from './types';

@WebSocketGateway({ path: '/socket', serveClient: false, cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private appService: AppService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage<MeetEvent>('new-meet')
  createNewMeet(): Promise<NewMeetAck> {
    return this.appService.createNewMeet();
  }

  @SubscribeMessage<MeetEvent>('join')
  joinTheMeet(client: Socket, payload: JoinPayload): Promise<JoinAck> {
    return this.appService.join(client, payload);
  }
  @SubscribeMessage<MeetEvent>('left')
  leftTheMeet(client: Socket, payload: string): Promise<void> {
    return this.appService.left(client, payload);
  }

  @SubscribeMessage<MeetEvent>('signal')
  handlePeerSignal(client: Socket, payload: SignalPayload): Promise<void> {
    return this.appService.handlePeerSignal(client, payload);
  }

  @SubscribeMessage<MeetEvent>('init-peer')
  handlePeerInit(client: Socket, payload: User): Promise<void> {
    return this.appService.handlePeerInit(client, payload);
  }

  @SubscribeMessage<MeetEvent>('message')
  handleMessage(client: Socket, payload: Omit<Message, 'id'>): Promise<Message> {
    return this.appService.handleMessage(client, payload);
  }

  handleDisconnect(client: Socket) {
    const meetId = [...client.rooms].find((room) => room !== client.id);
    if (meetId) {
      this.appService.left(client, meetId);
    }
  }

  handleConnection(client: Socket) {
    console.log(client.id, ' connected');
  }
}
