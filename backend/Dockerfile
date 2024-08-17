FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./start.sh

EXPOSE 5000

CMD ["./start.sh"]
