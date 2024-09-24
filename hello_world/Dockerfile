FROM node:20.15.1-alpine AS builder


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20.15.1-alpine

WORKDIR /app
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules/
COPY --from=builder --chown=node:node /app/dist ./dist/

EXPOSE 8080
USER node

CMD [ "node", "dist/main.js" ]
