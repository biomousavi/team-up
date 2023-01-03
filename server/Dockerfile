FROM node:18.12.1-alpine AS development
RUN apk update && apk add bash
WORKDIR /usr/src/server
COPY package*.json ./
RUN npm install
COPY . . 
ENV NODE_ENV=development
CMD [ "npm", "run", "start:dev" ]
EXPOSE ${SERVER_PORT}


FROM node:18.12.1-alpine AS production
RUN apk update && apk add bash
WORKDIR /usr/src/server
COPY package*.json ./
RUN npm install
COPY . . 
ENV NODE_ENV=production
RUN npm run build
CMD [ "node", "dist/main.js" ]
EXPOSE ${SERVER_PORT}