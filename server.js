/* NPM Installation Dependencies */
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const uuid = require('uuid/v4');

const BoardMember = require('./models/boardMember');
const { generateToken, sendToken, findOrCreateUser } =
  require('./auth');

require('dotenv').config({ path: path.join(__dirname + '/.env') });

/* Server Initialization */
const app = express();
const server = require('http').Server(app);

/* Middleware Functionality */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  genid: (request) => {
    return uuid() // use UUIDs for session IDs
  },
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

let corsOption = {
  credentials: true,
  exposedHeaders: ['x-auth-token'],
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  origin: true
};

app.use(cors(corsOption));


app.route("/")
  .post((request, response) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailText = `Hello URMC,\n\nI'm ${request.body.name} and I'm a ${request.body.position} at ${request.body.company}. We are interested in sponsoring URMC! Please reach out to me at ${request.body.email}. Looking forward to speaking with you!\n\nCheers!\n\n- ${request.body.name}`;

    const mailOptions = {
      from: process.env.EMAIL_ACCOUNT,
      to: 'urmc@cornell.edu',
      subject: `Interest in URMC Sponsorship from ${request.body.company}`,
      text: mailText
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) response.send(error);
      else response.send(info.response);
    });
  });

app.route("/board-members/:id")
  .get((request, response) => {
    console.log("GOT IT")
    console.log(request.params);
  })
  .post((request, response) => {
    console.log("GOT IT")
    console.log(request.params);
    console.log(request.body);
  });

app.route("/board-members")
  .get((request, response) => {
    BoardMember.find((error, members) => {
      response.send(members);
    });
  })

  .post((request, response) => {

  });

app.route('/google/auth')
  .post(async (request, response, next) => {
    request.session.accessToken = request.body.access_token;
    request.user = request.body.profile;

    next();
  }, generateToken, sendToken);

const port = process.env.PORT || 8080;

server.listen(port, function () {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

module.exports = server;
