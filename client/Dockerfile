FROM node:22-alpine AS development
RUN apk update && apk add bash
WORKDIR /usr/src/client
COPY package*.json ./
RUN npm install
COPY . . 
ENV NODE_ENV=development
CMD [ "npm", "run", "dev" ]
EXPOSE ${VITE_SERVER_PORT}