From node:14
WORKDIR /src
COPY package*.json ./
RUN npm install
RUN npm i pm2 -g
COPY . .
EXPOSE 5000
CMD pm2 start ./src/index.js

