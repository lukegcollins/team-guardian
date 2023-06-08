// Import required modules and files
const dotenv = require("dotenv").config();
const logger = require('./logger');
const path = require('path');
const session = require('express-session');
const { create } = require("domain");
const pgSession = require('connect-pg-simple')(session);
const sessionPool = require('pg').Pool;

// Get the base name of the current file
const fn = path.basename(__filename);

module.exports = {
  sessionConfig: {
    store: new pgSession({
      pool: new sessionPool({
        user: process.env.FS_DB_USER,
        password: process.env.FS_DB_PASS,
        host: process.env.FS_DB_HOST,
        port: process.env.FS_DB_PORT,
        database: process.env.FS_DB_NAME
      }),
      tableName: 'session',
      createTableIfMissing: true
    }),
    name: 'SID',
    secret: process.env.FS_DB_SESSIONS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    }
  }
};
