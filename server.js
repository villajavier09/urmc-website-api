/* NPM Installation Dependencies */
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

require('dotenv').config({ path: path.join(__dirname + '/.env') });

/* Server Initialization */
const app = express();
const server = require('http').Server(app);

/* Middleware Functionality */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

    let mailText = `Hello,
    
    I'm ${request.body.name} and I'm a ${request.body.position} at ${request.body.company}. We are interested in sponsoring URMC! Please reach out to me at ${request.body.email}. Looking forward to speaking with you!
    
    Cheers!
    
    - ${request.body.name}`;

    const mailOptions = {
      from: process.env.EMAIL_ACCOUNT,
      to: 'ramiabdou98@gmail.com',
      subject: `Interest in URMC Sponsorship from ${request.body.company}`,
      text: mailText
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) response.send(error);
      else response.send(info.response);
    });
  });

const port = process.env.PORT || 8080;

server.listen(port, function () {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

module.exports = server;