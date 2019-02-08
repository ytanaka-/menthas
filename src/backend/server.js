const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const config = require('config');
mongoose.connect(process.env.MONGO_URL || config.mongo.URL, { useNewUrlParser: true });

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(helmet());
server.use(express.static(path.join(__dirname, '../../public')));
server.use('/', require('./controller/index'));
server.use('/api/', require('./controller/api'));

server.set('views', path.join(__dirname, 'view'));
server.set('view engine', 'pug');
server.disable('x-powered-by');

server.listen(port, (err) => {
  if (err) throw err
  console.log(`server start => port:${port}`);
});