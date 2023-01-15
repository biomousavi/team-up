import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { JoinAck, JoinPayload, MeetEvent, User, SignalPayload, Message } from '@/types';
import type SimplePeer from 'simple-peer';
import Peer from 'simple-peer/simplepeer.min.js';
import { useUserStore } from './user';
import socket from '../socket';

export const useMeetStore = defineStore('meet', () => {
  const localUser = useUserStore();

  const meetId = ref<string | null>();

  // Meet Chat
  const chatOn = ref<boolean>(false);
  const handRaised = ref<boolean>(false);
  const micOn = ref<boolean>(true);
  const camOn = ref<boolean>(true);
  const showNavigation = ref<boolean>(true);
  const screenShareOn = ref<boolean>(false);
  const screenRecordOn = ref<boolean>(false);

  const mediaRecorder = ref<MediaRecorder | null>();

  // Meet messages
  const messages = ref<Message[]>([]);

  // Meet Users
  const users = ref<User[]>([]);

  const date = ref<Date>(new Date());
  // update Date object every minute
  const dateInterval = setInterval(() => (date.value = new Date()), 60000);

  const localStream = ref<MediaStream | null>(null);
  const peers = ref<{ [key: string]: SimplePeer.Instance }>({});

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
    const message: Message = {
      text,
      meetId: meetId.value!,
      user: {
        id: localUser.id!,
        name: localUser.name!,
        email: localUser.email!,
      },
    };
    socket.emit<MeetEvent>('message', message, (received: boolean) => {
      if (received) addMessage(message);
    });
  }

  function addMessage(message: Message) {
    messages.value.push(message);
  }

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

  async function toggleScreenRecording() {
    if (screenRecordOn.value) {
      stopRecordingScreen();
      screenRecordOn.value = false;
    } else {
      await recordScreen();
      screenRecordOn.value = true;
    }
  }

  function stopRecordingScreen() {
    mediaRecorder.value?.stop();
  }

  async function recordScreen() {
    try {
      // for better browser support
      const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
        ? 'video/webm; codecs=vp9'
        : 'video/webm';

      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
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
    } catch (error) {
      throw Error('Cant access to local stream.');
    }
  }

  async function toggleScreenSHaring() {
    console.log('togggg');

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
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });

      // when somebody clicked on "Stop sharing"
      stream.getVideoTracks()[0].onended = toggleScreenSHaring;

      switchPeerTracks(stream);
    } catch (error) {
      throw Error('Cant access to local stream.');
    }
  }

  const switchPeerTracks = (stream) => {
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
    }
  };

  async function getUserMediaPermission() {
    try {
      localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      switchPeerTracks(localStream.value);

      hideAlert();
    } catch (error) {
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

  function initPeer(payload: User) {
    socket.emit<MeetEvent>('init-peer', payload);
  }

  function createPeerConn(user: User, initiator: boolean) {
    const peerOptions: SimplePeer.Options = {
      initiator,
      stream: localStream.value!,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
    };

    peers.value[user.id] = new Peer(peerOptions);

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

    peers.value[user.id].on('connect', (data) => {
      console.log('connected to peer', data);
    });

    // // when we stablished connection with other users
    peers.value[user.id].on('stream', handlePeerSignal);
    function handlePeerSignal(data: MediaStream) {
      console.log('got stream');

      users.value.forEach((u) => {
        if (u.id === user.id) {
          u.mediaStream = data;
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

  let initConnInterval;
  async function initConnection() {
    try {
      await getUserMediaPermission();
      await joinToMeet();

      // remove created interval
      if (initConnInterval) clearInterval(initConnInterval);
    } catch (error) {
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
