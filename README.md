<div style='float: center'>
  <img style='width: 100px; background-color:white;' src="https://github.com/biomousavi/team-up/raw/main/client/public/team.png"></img>
</div>

# TeamUp
Real-time meetings by TeamUp. Using your browser, share your video, desktop, and presentations with teammates and customers.


#### Technologies and Structure
- [Nest.js and Fastify](https://nestjs.com/) (as backend framework)
- [Socket.io](https://socket.io/) (for signaling)
- [full-mesh topology](https://en.wikipedia.org/wiki/Network_topology#Fully_connected_network) (for peers connection)
- [WebRTC](https://webrtc.org/) (to share streams)
- [Vue.js](https://vuejs.org/) (as UI framework)


#### Features
- Video Meeting
- Group messaging
- Screen sharing (only PC)
- Screen recording (only PC)


## Instaliation

Install [Docker and docker-compose](https://www.docker.com/) .

## Start

At the root of the project, run:

```bash
docker-compose build
docker-compose up
```