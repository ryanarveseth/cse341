const express = require('express');
const router = express.Router();

router.get('/some-get', (req, res, next) => {

});

router.post('/some-post', (req, res, next) => {

});

router.get('/', (req, res, next) => {
  res.send('<h1>Home page</h1>');
});




module.exports = router;

