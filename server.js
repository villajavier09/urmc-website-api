/* NPM Installation Dependencies */
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const uuid = require('uuid/v4');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const BoardMember = require('./models/boardMember');
const PendingBoardMember = require('./models/pendingBoardMember');
const { generateToken, sendToken } = require('./auth');

require('dotenv').config({ path: path.join(__dirname + '/.env') });

/* Server Initialization */
const app = express();
const server = require('http').Server(app);

app.use('/public', express.static(path.join(__dirname, 'public')))

const upload = multer({
  dest: './public/uploads/' // This saves our files into a directory called "uploads".
});

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

app.route("/board-members")
  .get(async (request, response) => {
    const members = await BoardMember.find();
    response.send(members);
  })

  .post(upload.single('profilePicture'), (request, response) => {
    BoardMember.create(request.body).then((member) => {
      response.send(member);
    })
  })

  .delete(async (request, response) => {
    let fileNames = []; // Names of image files.

    for (let memberID of request.body.memberIDs) {
      let member = await BoardMember.findById(memberID);
      if (member.picture) fileNames.push(member.picture);
    }

    BoardMember.deleteMany({ _id: request.body.memberIDs })
      .then(async (message) => {

        for (let fileName of fileNames) {
          deleteImage(fileName);
        }

        response.send(message);
      });
  });

app.route('/pending-board-members')
  .get(async (request, response) => {
    let pendingMembers = await PendingBoardMember.find();
    response.send(pendingMembers);
  });

const deleteImage = (fileName) => {
  fs.unlinkSync(`./public/uploads/${fileName}`);
}

app.route("/board-members/:id")
  .put((request, response) => {
    BoardMember.update({ _id: mongoose.Types.ObjectId(request.params.id) }, request.body)
      .then(() => response.send("Update was successful."))
      .catch(() => response.send("Update not successful."));
  });

app.route("/board-members/:id/profile-picture")
  .put(upload.single('imageData'), async (request, response) => {
    if (!request.file) return;

    let userID = request.params.id;
    let member = await BoardMember.findById(userID);
    let prevFileName = member.picture;

    BoardMember.update({ _id: mongoose.Types.ObjectId(userID) },
      { picture: request.file.filename })
      .then(() => {
        deleteImage(prevFileName);
        response.send("Upload was successful.")
      })
      .catch(() => response.send("Upload not successful."));
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
