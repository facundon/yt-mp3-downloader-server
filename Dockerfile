FROM node:14-alpine3.10 as base
WORKDIR /app

FROM base as builder
COPY ["package.json" ,"yarn.lock", "./"]
RUN yarn install --production --pure-lockfile
COPY . .
RUN yarn build

FROM base
COPY --from=builder /tmp/node_modules/ ./node_modules/
COPY --from=builder /dist .
EXPOSE 8080
CMD ["node", "index.js"]

