import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { JoinAck, JoinPayload, MeetEvent, User, SignalPayload } from '@/types';
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

  // Meet Users
  const users = ref<User[]>([]);
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

  async function getUserMediaPermission() {
    try {
      localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
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
      // TODO:
      console.log('eeeeeeeeeerrror', error);
    });

    // when we get candidate from stun server
    peers.value[user.id].on('signal', handlePeerOpenEvent);
    function handlePeerOpenEvent(data: SimplePeer.SignalData) {
      const payload: SignalPayload = { user, data };

      socket.emit<MeetEvent>('signal', payload);
    }

    peers.value[user.id].on('connect', (data) => {
      // TODO:
      console.log('cooooooooonectedxxxxxxxxxxxxxxx', data);
    });

    // // when we stablished connection with other users
    peers.value[user.id].on('stream', handlePeerSignal);
    function handlePeerSignal(data: MediaStream) {
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
  };
});
