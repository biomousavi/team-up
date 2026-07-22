import { ref, shallowRef, markRaw } from 'vue';
import Peer from 'simple-peer';
import { defineStore } from 'pinia';
import type SimplePeer from 'simple-peer';
import type { JoinAck, JoinPayload, MeetEvent, User, SignalPayload, Message, OutgoingMessage } from '@/types';
import { useUserStore } from './user';
import socket from '../socket';

type PeerWithConnection = SimplePeer.Instance & { _pc: RTCPeerConnection };

// Cap the outgoing send bitrate per track. Video uses the passed cap
// (camera vs screen-share); audio always gets the high-quality Opus cap.
async function capSenderBitrate(peer: SimplePeer.Instance, videoBitrate: number) {
  const pc = (peer as unknown as PeerWithConnection)._pc;
  if (!pc) return;

  for (const sender of pc.getSenders()) {
    const kind = sender.track?.kind;
    if (kind !== 'video' && kind !== 'audio') continue;

    const params = sender.getParameters();
    if (!params.encodings?.length) params.encodings = [{}];
    params.encodings[0].maxBitrate = kind === 'video' ? videoBitrate : AUDIO_MAX_BITRATE;
    await sender.setParameters(params);
  }
}

// Quality-first caps (this is a demo — favor quality over mesh bandwidth).
const CAMERA_MAX_BITRATE = 4_000_000;
const SCREEN_SHARE_MAX_BITRATE = 5_000_000;
const AUDIO_MAX_BITRATE = 96_000;

export const useMeetStore = defineStore('meet', () => {
  const localUser = useUserStore();

  const meetId = ref<string | null>();
  const setMeetId = (id: string) => (meetId.value = id);

  // Meet Chat
  const chatOn = ref<boolean>(false);
  const handRaised = ref<boolean>(false);
  const micOn = ref<boolean>(true);
  const camOn = ref<boolean>(true);
  const showNavigation = ref<boolean>(true);
  const screenShareOn = ref<boolean>(false);
  const screenRecordOn = ref<boolean>(false);

  const mediaRecorder = shallowRef<MediaRecorder | null>();

  // Meet messages
  const messages = ref<Message[]>([]);

  // Meet Users
  const users = ref<User[]>([]);

  const date = ref<Date>(new Date());
  // update Date object every minute
  const dateInterval = setInterval(() => (date.value = new Date()), 60000);

  const localStream = shallowRef<MediaStream | null>(null);
  const peers = shallowRef<{ [key: string]: SimplePeer.Instance }>({});

  const alertMessage = ref<string | null>();
  const hideAlert = () => (alertMessage.value = null);
  const showAlert = (message: string) => (alertMessage.value = message);

  // Credentials Modal
  const credentialsModal = ref<boolean>(false);
  const showCredentialModal = () => (credentialsModal.value = true);
  const hideCredentialModal = () => (credentialsModal.value = false);

  // Error Modal
  const errorModal = ref<boolean>(false);
  const errorMessage = ref<string | null>(null);
  function hideError() {
    errorModal.value = false;
    errorMessage.value = null;
  }
  function showError(message: string) {
    errorModal.value = true;
    errorMessage.value = message;
  }

  function sendMessage(text: string) {
    const message: OutgoingMessage = {
      text,
      meetId: meetId.value!,
      user: {
        id: localUser.id!,
        name: localUser.name!,
        email: localUser.email!,
      },
    };
    socket.emit<MeetEvent>('message', message, (ack: Message) => addMessage(ack));
  }

  const addMessage = (message: Message) => messages.value.push(message);

  function addUser(newUser: User) {
    const userExists = users.value.find((user) => user.id === newUser.id);

    // if user not exist, add it to users array
    if (!userExists) users.value.push(newUser);
  }

  function removeUser(id: string) {
    // destroy remote peer
    if (peers.value[id]) {
      peers.value[id].destroy();
      delete peers.value[id];
    }

    // remove user from users array
    users.value = users.value.filter((user) => user.id !== id);
  }

  const stopRecordingScreen = () => mediaRecorder.value?.stop();

  async function toggleScreenRecording() {
    if (screenRecordOn.value) {
      stopRecordingScreen();
      screenRecordOn.value = false;
    } else {
      await recordScreen();
      screenRecordOn.value = true;
    }
  }

  async function recordScreen() {
    try {
      // for better browser support
      const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
        ? 'video/webm; codecs=vp9'
        : 'video/webm';

      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
      });
      mediaRecorder.value = new MediaRecorder(stream, { mimeType });

      const chunks: Blob[] = [];
      mediaRecorder.value?.addEventListener('dataavailable', function (e) {
        chunks.push(e.data);
      });

      mediaRecorder.value.addEventListener('stop', function () {
        const blob = new Blob(chunks, {
          type: chunks[0].type,
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'video.webm';

        stream?.getTracks().forEach((track) => track.stop());
        a.click();
      });

      mediaRecorder.value.start();
    } catch {
      throw Error('Cant access to local stream.');
    }
  }

  async function toggleScreenSHaring() {
    if (screenShareOn.value) {
      screenShareOn.value = false;
      await getUserMediaPermission();
    } else {
      screenShareOn.value = true;
      await getUserScreenMedia();
    }
  }

  async function getUserScreenMedia() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
      });

      // when somebody clicked on "Stop sharing"
      stream.getVideoTracks()[0].onended = toggleScreenSHaring;

      switchPeerTracks(stream, SCREEN_SHARE_MAX_BITRATE);
    } catch {
      throw Error('Cant access to local stream.');
    }
  }

  const switchPeerTracks = (stream: MediaStream, maxBitrate: number) => {
    for (const socket_id in peers.value) {
      for (const index in peers.value[socket_id].streams[0].getTracks()) {
        for (const index2 in stream.getTracks()) {
          if (
            peers.value[socket_id].streams[0].getTracks()[index].kind ===
            stream.getTracks()[index2].kind
          ) {
            peers.value[socket_id].replaceTrack(
              peers.value[socket_id].streams[0].getTracks()[index],
              stream.getTracks()[index2],
              peers.value[socket_id].streams[0],
            );
            break;
          }
        }
      }

      capSenderBitrate(peers.value[socket_id], maxBitrate);
    }
  };

  async function getUserMediaPermission() {
    try {
      localStream.value = markRaw(
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
          },
          // 1080p ideal = native for virtually every webcam; the local
          // self-view renders this raw capture, so this is what makes your
          // own tile crisp.
          video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
        }),
      );
      switchPeerTracks(localStream.value, CAMERA_MAX_BITRATE);

      hideAlert();
    } catch {
      showAlert(
        'PERMISSION_ERROR: We neet to access to camera and microphone. ' +
          'allow permissions and refresh the page.',
      );
      throw Error('Cant access to local stream.');
    }
  }

  function toggleCamera() {
    camOn.value = !camOn.value;

    localStream.value?.getVideoTracks().forEach((video) => {
      video.enabled = camOn.value;
    });
  }

  function toggleMicrophone() {
    micOn.value = !micOn.value;

    localStream.value?.getAudioTracks().forEach((audio) => {
      audio.enabled = micOn.value;
    });
  }

  function leaveRoom() {
    // stop local stream
    stopStream(localStream.value!);

    // remove all remote users
    users.value.forEach((user) => removeUser(user.id));

    // leave the socket room
    socket.emit<MeetEvent>('left', meetId.value);

    // reset states
    micOn.value = true;
    camOn.value = true;
    localStream.value = null;
    peers.value = {};
  }

  function stopStream(stream: MediaStream) {
    stream?.getTracks().forEach((track) => track.stop());
  }

  function handlePeerSignal(payload: SignalPayload) {
    if (peers.value[payload.user.id]) {
      peers.value[payload.user.id].signal(payload.data);
    }
  }

  const initPeer = (payload: User) => socket.emit<MeetEvent>('init-peer', payload);

  function createPeerConn(user: User, initiator: boolean) {
    const peerOptions: SimplePeer.Options = {
      initiator,
      stream: localStream.value!,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
    };

    peers.value[user.id] = markRaw(new Peer(peerOptions));

    // catch error event
    peers.value[user.id].on('error', (error) => {
      console.log('peer connection error', error);
    });

    // when we get candidate from stun server
    peers.value[user.id].on('signal', handlePeerOpenEvent);
    function handlePeerOpenEvent(data: SimplePeer.SignalData) {
      const payload: SignalPayload = { user, data };

      socket.emit<MeetEvent>('signal', payload);
    }

    peers.value[user.id].on('connect', (data: unknown) => {
      console.log('connected to peer', data);
      capSenderBitrate(peers.value[user.id], CAMERA_MAX_BITRATE);
    });

    // // when we stablished connection with other users
    peers.value[user.id].on('stream', handlePeerSignal);
    function handlePeerSignal(data: MediaStream) {
      console.log('got stream');

      users.value.forEach((u) => {
        if (u.id === user.id) {
          u.mediaStream = markRaw(data);
          return u;
        }
      });
    }
  }

  async function joinToMeet() {
    const payload: JoinPayload = {
      name: localUser.name!,
      email: localUser.email!,
      meetId: meetId.value!,
    };

    socket.emit<MeetEvent>('join', payload, handleJoinAck);
  }

  function handleJoinAck(ack: JoinAck) {
    if (ack.status === 'error') {
      showError(ack.message!);
    } else {
      users.value = ack.users!;
      messages.value = ack.messages!;
    }
  }

  let initConnInterval: ReturnType<typeof setInterval>;
  async function initConnection() {
    try {
      await getUserMediaPermission();
      await joinToMeet();

      // remove created interval
      if (initConnInterval) clearInterval(initConnInterval);
    } catch {
      // repeat the process
      if (!initConnInterval) {
        initConnInterval = setInterval(initConnection, 1000);
      }
    }
  }

  return {
    initConnection,
    stopStream,
    localStream,
    hideError,
    showError,
    chatOn,
    date,
    meetId,
    users,
    setMeetId,
    addUser,
    removeUser,
    dateInterval,
    alertMessage,
    errorModal,
    errorMessage,
    credentialsModal,
    showCredentialModal,
    hideCredentialModal,
    createPeerConn,
    handlePeerSignal,
    initPeer,
    leaveRoom,
    handRaised,
    micOn,
    camOn,
    toggleCamera,
    toggleMicrophone,
    showNavigation,
    sendMessage,
    messages,
    addMessage,
    toggleScreenSHaring,
    screenShareOn,
    recordScreen,
    toggleScreenRecording,
    screenRecordOn,
  };
});
