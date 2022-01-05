const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.database.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const taSchema = new mongoose.Schema({
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
  email: String,
  taClass: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  classes: [String],
  netId: String,
  picture: String
},
  { collection: 'tadirectory' });

const TA = mongoose.model('TA', taSchema);

module.exports = TA;
