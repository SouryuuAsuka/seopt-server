FROM node:18

# создание директории приложения
WORKDIR /usr/src/docker/test/seopt/server

COPY package*.json ./

RUN npm install

# копируем исходный код
COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]