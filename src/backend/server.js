const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require('compression');
const mongoose = require("mongoose");
const config = require("config");
const DB_NAME = process.env.MONGO_DB_NAME || config.mongo.DB_NAME;
mongoose.connect(process.env.MONGO_URL || config.mongo.URL, {
  dbName: DB_NAME,
});
const port = process.env.PORT || 3000;

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(helmet());
server.use(compression());
server.use(
  express.static(path.join(__dirname, "../../public"), { maxAge: "5m" }),
);
server.use("/", require("./controller/index"));
server.use("/api/", require("./controller/api"));
server.set("views", path.join(__dirname, "view"));
server.set("view engine", "pug");
server.disable("x-powered-by");
server.listen(port, (err) => {
  if (err) throw err;
  console.log(`server start => port:${port}`);
});
