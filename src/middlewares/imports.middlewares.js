const express = require("express");
const configObject = require("../config/env.config");
const path = require("path");
const cookieParser = require("cookie-parser");
const { engine } = require("express-handlebars");
const { logger } = require("./logger.middleware");
const passport = require("passport");
const auth = require("./auth.middleware");
const initializePassport = require("../config/passport.config");
const setupRoutes = require("./routes.middlewares");
const Handlebars = require('handlebars');

require("../config/connection");

const app = express();
const PORT = configObject.server.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(passport.initialize());
app.use(auth);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

initializePassport();
setupRoutes(app);

module.exports = {
  app,
  PORT,
  logger,
};
