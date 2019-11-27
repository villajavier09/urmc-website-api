/* NPM Installation Dependencies */
const express = require('express');
const bodyParser = require('body-parser');

/* Server Initialization */
const app = express();
const server = require('http').Server(app);

/* Middleware Functionality */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.route("/")
  .get((request, response) => {
    response.send("HELLO THERE!")
  });

const port = process.env.PORT || 8080;

server.listen(port, function () {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

module.exports = server;
