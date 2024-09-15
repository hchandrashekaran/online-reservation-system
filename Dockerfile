FROM node:alpine
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY ./src ./src
COPY ./index.js ./
COPY ./server.js ./
COPY ./swagger.js ./
CMD ["npm", "start"]