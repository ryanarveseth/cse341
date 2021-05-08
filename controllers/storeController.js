const products = [];

module.exports.getHomePage = (request, response, next) => {
  response.render('pages/store', {
    title: 'Finding your dream car. Made easier.',
    path: '/',
    products: products
  });
}

module.exports.getBuyPage = (request, response, next) => {
  response.render('pages/store/buy', {
    title: 'Find your dream car',
    path: '/cars/find',
    products: products
  });
}

module.exports.getSellPage = (request, response, next) => {
  response.render('pages/store/sell', {
    title: 'Sell your car',
    path: '/cars/sell',
    products: products
  });
}
