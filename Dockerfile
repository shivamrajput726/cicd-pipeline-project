# App image (built by Jenkins)
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /home/node/app

COPY --chown=node:node app/package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node app/ ./

EXPOSE 3001
USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/health || exit 1

CMD ["npm", "start"]
