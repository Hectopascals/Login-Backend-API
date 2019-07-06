import 'babel-polyfill';
import db from '../db';
import jwt from 'jwt-simple';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.SECRET;

// Checks for valid token and email in DB
const checkValidUser = token => {
  const decoded = jwt.decode(token, secret);
  const findEmailQuery = `SELECT email FROM users WHERE email=$1`;

  if (decoded.email) {
    const values = [decoded.email];

    return new Promise(resolve => {
      db.query(findEmailQuery, values)
        .then(result => {
          resolve(Boolean(result.rowCount));
        })
        .catch(err => {
          reject(false);
        });
    });
  } else {
    return false;
  }
};

// GET /users
const getUsers = async (req, res) => {
  const getAllUsersQuery = 'SELECT email, firstName, lastname FROM users';

  try {
    const token = req.headers['x-authentication-token'];

    if (await checkValidUser(token)) {
      db.query(getAllUsersQuery)
        .then(result => {
          return res.status(200).send({ users: result.rows });
        })
        .catch(err => {
          return res.status(404).send({ message: `Error: ${err.detail}` });
        });
    } else {
      return res.status(404).send({ message: `Error: Invalid Token` });
    }
  } catch (error) {
    return res.status(404).send({ message: `${error}` });
  }
};

// POST /signup
const createUser = (req, res) => {
  const createUserQuery = `INSERT INTO
  users(email, password, firstName, lastName)
  VALUES ($1, $2, $3, $4)`;

  try {
    const { email, password, firstName, lastName } = req.body;
    const token = jwt.encode({ email: email }, secret);
    const values = [email, password, firstName, lastName];

    db.query(createUserQuery, values)
      .then(result => {
        return res.status(201).send({ token });
      })
      .catch(err => {
        return res.status(409).send({ message: `Error: ${err.detail}` });
      });
  } catch (error) {
    return res.status(404).send({ message: `${error}` });
  }
};

// PUT /users
const updateUser = async (req, res) => {
  const updateQuery = `UPDATE users 
    SET firstName=$1, lastName=$2 
    WHERE email=$3`;

  try {
    const token = req.headers['x-authentication-token'];
    const { firstName, lastName } = req.body;
    const decoded = jwt.decode(token, secret);
    const values = [firstName, lastName, decoded.email];

    if (await checkValidUser(token)) {
      db.query(updateQuery, values)
        .then(result => {
          return res
            .status(200)
            .send({ message: "User's name has been updated." });
        })
        .catch(err => {
          return res.status(404).send({ message: `Error: ${err.detail}` });
        });
    } else {
      return res.status(404).send({ message: `Error: Invalid Token` });
    }
  } catch (error) {
    return res.status(404).send({ message: `${error}` });
  }
};

// POST /login
const loginUser = (req, res) => {
  const findQuery = `SELECT * FROM users 
  WHERE email=$1 AND password=$2`;

  try {
    const { email, password } = req.body;
    const token = jwt.encode({ email: email }, secret);
    const values = [email, password];

    db.query(findQuery, values)
      .then(result => {
        if (result.rowCount === 0) {
          return res
            .status(404)
            .send({ message: 'Incorrect username and/or password' });
        }
        return res.status(200).send({ token });
      })
      .catch(err => {
        return res.status(404).send({ message: `Error: ${err.detail}` });
      });
  } catch (error) {
    return res.status(404).send({ message: `${error}` });
  }
};


module.exports = {
  getUsers,
  createUser,
  loginUser,
  updateUser
};
