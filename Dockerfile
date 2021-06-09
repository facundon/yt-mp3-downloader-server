FROM node:14-alpine3.10 AS base
RUN apk add --no-cache python2
RUN apk add --no-cache py2-pip
RUN apk add --no-cache ffmpeg
RUN pip2 install --upgrade youtube-dl
WORKDIR /app
COPY package.json ./

FROM base AS dev
COPY yarn.lock ./
RUN npm i
COPY ./src ./src
COPY tsconfig.json ./

FROM dev AS build
RUN npm run build

FROM base AS prod
RUN npm i --production
COPY --from=build app/dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
