const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  postLogin,
  newUser,
  resetPassword,
  userResetPassword,
  replacePassword
} = require('../../controllers/loginController');

const isAuth = require('../../middleware/is-auth');

router
  .get('/login', login)
  .get('/login-new', newUser)
  .post("/reset-password", resetPassword)
  .get("/reset-password/:token", userResetPassword)
  .post("/replace-password", replacePassword)
  .post('/login', postLogin)
  .get('/logout', isAuth, logout);


module.exports = router;