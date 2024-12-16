FROM node:23.3 AS builder


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run generate

FROM node:23.3

WORKDIR /app
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules/
COPY --from=builder --chown=node:node /app/dist ./dist/

EXPOSE 3000
USER node
CMD ["npx", "serve", "-l", "3000", "-s", "dist"]
