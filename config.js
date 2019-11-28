const path = require("path");

// Import environment variables.
require('dotenv').config({ path: path.join(__dirname + '/.env') });

const config = {
  default: {
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

const getConfig = (env) => {
  return config[env] || config.default;
}

module.exports = { getConfig };
