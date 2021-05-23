const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  postLogin,
  newUser
} = require('../../controllers/loginController');

const isAuth = require('../../middleware/is-auth');

router
  .get('/login', login)
  .get('/login-new', newUser)
  .post('/login', postLogin)
  .get('/logout', isAuth, logout);


module.exports = router;