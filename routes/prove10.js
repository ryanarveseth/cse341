const {getAvengersPage, fetchAllAvengers, insertAvenger} =  require("../controllers/prove11");
const express = require('express');
const router = express.Router();

router.get('/', getAvengersPage);

router.get("/api/fetchAll", fetchAllAvengers);

router.post("/api/insert", insertAvenger);

module.exports = router;