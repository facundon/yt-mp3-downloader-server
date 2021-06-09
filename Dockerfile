FROM node:14-alpine3.10 AS base
RUN apk add --no-cache python2
RUN apk add --no-cache py2-pip
RUN apk add --no-cache ffmpeg
RUN pip2 install --upgrade youtube-dl
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN npm i --production
COPY tsconfig.json ./
COPY ./src ./src
ENV NODE_ENV=production
EXPOSE 8080
CMD ["npx", "ts-node", "src/index.ts"]
