const express = require('express');
const router = express.Router();
const {getHomePage, getBuyPage, getSellPage} = require('../../controllers/storeController');

router
  .get('/', getHomePage)
  .get('/cars/find', getBuyPage)
  .get('/cars/sell', getSellPage)

  .use((req, res, next) => {
    // 404 page
    res.render('pages/store/404', {title: '404 - Page Not Found', path: req.url})
  })



module.exports = router;
