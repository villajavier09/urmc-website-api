const path = require("path");

// Import environment variables.
require('dotenv').config({ path: path.join(__dirname + '/.env') });

const config = {
  development: {
    database: {
      DB_URL: process.env.LOCAL_DB_URL
    }
  },
  production: {
    database: {
      DB_URL: process.env.STAGE_DB_URL
    },
  }
}

module.exports = config[process.env.NODE_ENV];
