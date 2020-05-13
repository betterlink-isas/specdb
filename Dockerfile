FROM node:13

WORKDIR /usr/src/specdb

COPY package*.json ./

RUN npm ci --only=production

COPY . .

WORKDIR /usr/src/specdb/run

EXPOSE 8080

CMD [ "node", "../build/main.js" ]
