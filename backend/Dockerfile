FROM node:22-alpine


ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV WDS_SOCKET_PORT=0 

WORKDIR /app

COPY package.json .


RUN  npm install   

COPY . .

CMD [ "npm","start" ]


