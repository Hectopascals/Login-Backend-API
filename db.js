const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// This file is for configuring our DB users table

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('Connected to the DB');
});

pool.on('remove', () => {
  // console.log('Client removed');
  process.exit(0);
});

const createTable = () => {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS
      users(
        email VARCHAR(128) PRIMARY KEY,
        password VARCHAR(128) NOT NULL,
        firstName VARCHAR(128) NOT NULL,
        lastName VARCHAR(128) NOT NULL
      )`;

  pool
    .query(createTableQuery)
    .then(res => {
      console.log(res);
      pool.end();
    })
    .catch(err => {
      console.log('Error:', err);
      pool.end();
    });
};

const dropTable = () => {
  const dropTableQuery = 'DROP TABLE IF EXISTS users';

  pool
    .query(dropTableQuery)
    .then(res => {
      console.log(res);
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
};

module.exports = {
  createTable,
  dropTable
};

// To call the functions from terminal
require('make-runnable');