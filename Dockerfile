FROM node:10.8-alpine

WORKDIR app

COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
RUN npm install

COPY ./config/default.json config/default.json
COPY ./src src
COPY ./public public
COPY ./webpack.config.js webpack.config.js 

RUN npm run build