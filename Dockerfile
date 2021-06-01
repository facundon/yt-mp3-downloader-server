FROM node:14-alpine3.10 AS base
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN npm i --production
COPY tsconfig.json ./
COPY ./src ./src
ENV NODE_ENV=production
