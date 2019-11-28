const mongoose = require('mongoose');
const config = require('../config').getConfig(process.env.NODE_ENV);

mongoose.connect(config.database.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const boardMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  socials: {
    I: String,
    F: String,
    L: String
  },
  position: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  askMe: [String],
  netId: String
});

const BoardMember = mongoose.model('BoardMember', boardMemberSchema);

module.exports = BoardMember;
