const {login, getUsersOnline, logout} =  require("../controllers/prove12");
const express = require('express');
const router = express.Router();

router.get("/users-online", getUsersOnline);
router.post("/logout", logout);
router.post("/login", login);

module.exports = router;