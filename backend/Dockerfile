FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npx nodemon server.js; else npm start; fi"]

EXPOSE 5000
