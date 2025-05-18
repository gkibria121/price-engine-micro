FROM node:22-alpine


ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV WDS_SOCKET_PORT=0 
ENV TZ=Europe/London
WORKDIR /app

COPY package*.json .


RUN  npm install    --verbose 

COPY . .

CMD [ "npm","start" ]


