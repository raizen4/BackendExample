FROM node:12-alpine

WORKDIR /usr/app

# Environment
RUN apk add --update git bash
RUN yarn global add lerna webpack webpack-cli webpack-dev-server node-prune

# use node-prune in production docker file in order to reduce the image size.

# Dependencies

COPY package.json ./
COPY yarn.lock ./
COPY lerna.json ./
COPY client/web/agent/listing-ui-web/package.json ./client/web/agent/listing-ui-web/

RUN yarn install

# Build
ARG port=3000

COPY . ./

ENV NODE_ENV=production

RUN cd client/web/agent/listing-ui-web && yarn build

EXPOSE $port

WORKDIR /usr/app/client/web/agent/listing-ui-web

CMD yarn dev