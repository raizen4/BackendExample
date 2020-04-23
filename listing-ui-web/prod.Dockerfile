FROM boomindockerregistry.azurecr.io/microfrontend-base:12-alpine

COPY dist ./dist
COPY package.json ./
RUN yarn install --production=true