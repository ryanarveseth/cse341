const express = require('express');
const router = express.Router();
const {
  getHomePage,
  getBuyPage,
  getSellPage,
  addOrUpdateCarToSell,
  removeCar
} = require('../../controllers/storeController');

router
  .get('/', getHomePage)
  .get('/cars/find', getBuyPage)
  .get('/cars/find/:id', getBuyPage)
  .get('/cars/sell', getSellPage)
  .get('/cars/sell/:id', getSellPage)
  .get('/cars/delete/:id', removeCar)
  .post('/cars/sell', addOrUpdateCarToSell)

  .use((req, res, next) => {
    // 404 page
    res.render('pages/store/404', {title: '404 - Page Not Found', path: req.url})
  })

module.exports = router;
