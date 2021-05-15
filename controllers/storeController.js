const messages = require('../model/messages.json');
const Car = require('../model/Car');
const Seller = require('../model/Seller');

module.exports.getHomePage = (request, response, next) => {
  response.render('pages/store', {
    title: 'Finding your dream car. Made easier.',
    path: '/',
    messages: messages
  });
}

module.exports.getBuyPage = (request, response, next) => {
  if (request.params['id']) {
    Car.findById(request.params['id'])
      .populate('seller')
      .then(car => {
      response.render('pages/store/buy', {
        title: messages.findYourDreamCar,
        path: '/cars/find',
        cars: [],
        car: car || {},
        messages: messages
      });
    });
  } else {
    Car.find()
      .populate('seller')
      .then(cars => {
      response.render('pages/store/buy', {
        title: messages.findYourDreamCar,
        path: '/cars/find',
        cars: cars,
        car: undefined,
        messages: messages
      });
    });
  }
};

module.exports.getSellPage = (request, response, next) => {
  if (request.params['id']) {
    Car.findById(request.params['id'])
      .populate('seller')
      .then(car => {
      response.render('pages/store/sell', {
        title: messages.sellYourCar,
        path: '/cars/sell',
        car: car || {},
        messages: messages
      });
    });
  } else {
    response.render('pages/store/sell', {
      title: messages.sellYourCar,
      path: '/cars/sell',
      messages: messages,
      car: {seller: {}}
    });
  }
};

module.exports.addOrUpdateCarToSell = (request, response, next) => {
  let {
    make,
    model,
    year,
    src,
    price,
    description,
    sellerName,
    sellerEmail,
    sellerPhone,
    carId,
    sellerId
  } = request.body;

  if (sellerId && carId) {
    Seller.findById(sellerId).then(seller => {
      seller.name = sellerName;
      seller.email = sellerEmail;
      seller.phone = sellerPhone;
      seller.save();

      Car.findById(carId).then(car => {
        car.make = make;
        car.model = model;
        car.year = year;
        car.src = src;
        car.price = price;
        car.description = description;
        car.save().then(() => {
          response.redirect('/cars/find');
        });
      });
    });
  } else {
    const seller = new Seller({
      name: sellerName,
      email: sellerEmail,
      phone: sellerPhone
    });

    seller.save().then(savedSeller => {
      const car = new Car({
        make: make,
        model: model,
        year: year,
        src: src,
        price: price,
        description: description,
        seller: savedSeller._id
      });
      car.save().then(() => {
        response.redirect('/cars/find');
      });
    });
  }
}
;

module.exports.removeCar = (request, response, next) => {
  const id = request.params['id'] || "";

  if (id) {
    Car.findById(id).then(car => {
      Seller.findByIdAndDelete(car.seller._id).then(() => {
        Car.findByIdAndDelete(id).then(() => {
          response.redirect('/cars/find');
        });
      });
    });
  }
};

