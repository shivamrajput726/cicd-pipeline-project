# App image (built by Jenkins)
FROM node:20-alpine

WORKDIR /usr/src/app

COPY app/package.json ./package.json
RUN npm install --omit=dev

COPY app/ ./

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]

