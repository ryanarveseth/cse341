const express = require('express');
const router = express.Router();
const messages = require('../../model/messages.json');
const {
  getHomePage,
  getBuyPage,
  getSellPage,
  addOrUpdateCarToSell,
  removeCar,
  saveForLater,
  buyCar
} = require('../../controllers/storeController');
const {
  getCommentsPage
} = require('../../controllers/commentController');
const {
  getPokemonPage
} = require('../../controllers/pokemonController');

const isAuth = require('../../middleware/is-auth');

router
  .get('/', getHomePage)
  .get('/cars/find', getBuyPage)
  .get('/cars/find/:id', getBuyPage)
  .get('/cars/sell', isAuth, getSellPage)
  .post('/cars/sell', isAuth, addOrUpdateCarToSell)
  .get('/cars/saveForLater/:id', isAuth, saveForLater)
  .get('/cars/buy/:id', isAuth, buyCar)
  .get('/cars/sell/:id', isAuth, getSellPage)
  .get('/cars/delete/:id', isAuth, removeCar)
  .get('/pokemon', getPokemonPage)
  .post('/pokemon', getPokemonPage)
  .get(['/comments', '/comments/:page'], getCommentsPage);

module.exports = router;
