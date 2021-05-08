const cars = require('../model/available-cars.json');
const messages = require('../model/messages.json');

module.exports.getHomePage = (request, response, next) => {
  response.render('pages/store', {
    title: 'Finding your dream car. Made easier.',
    path: '/',
    cars: cars,
    messages: messages
  });
}

module.exports.getBuyPage = (request, response, next) => {
  let car;

  if (request.params['id']) {
    car = cars.find(prod => {
      return parseInt(prod.id) === parseInt(request.params['id'])
    });
  }

  response.render('pages/store/buy', {
    title: messages.findYourDreamCar,
    path: '/cars/find',
    cars: cars,
    car: car,
    messages: messages
  });
}

module.exports.getSellPage = (request, response, next) => {
  response.render('pages/store/sell', {
    title: messages.sellYourCar,
    path: '/cars/sell',
    explanation: 'This page will be finished in an upcoming week.',
    messages: messages
  });
}
