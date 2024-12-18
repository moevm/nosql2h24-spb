FROM node:23.3 AS builder


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

ARG BACKEND_HOST
ARG BACKEND_PORT
RUN echo BACKEND_HOST=${BACKEND_HOST} > ./.env
RUN echo BACKEND_PORT=${BACKEND_PORT} >> ./.env

RUN npm run generate

FROM node:23.3

WORKDIR /app
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules/
COPY --from=builder --chown=node:node /app/dist ./dist/

EXPOSE 3000
USER node
CMD ["npx", "serve", "-l", "3000", "-s", "dist"]
