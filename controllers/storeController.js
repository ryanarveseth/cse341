const messages = require('../model/messages.json');
const Car = require('../model/Car');
const Order = require('../model/Order');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

module.exports.getHomePage = (req, res, next) => {

  console.log('is logged in: ', req.session.authenticated);
  res.render('pages/store', {
    title: 'Finding your dream car. Made easier.',
    path: '/',
    messages: messages,
    showLogin: false,
  });
}

module.exports.getBuyPage = (req, res, next) => {
  if (req.params['id']) {
    Car.findById(req.params['id'])
      .populate('seller', '-password')
      .then(car => {
        res.render('pages/store/buy', {
          title: messages.findYourDreamCar,
          path: '/cars/find',
          cars: [],
          car: car || {},
          messages: messages
        });
      });
  } else {
    Car.find()
      .populate('seller', '-password')
      .then(cars => {
        res.render('pages/store/buy', {
          title: messages.findYourDreamCar,
          path: '/cars/find',
          cars: cars,
          car: undefined,
          messages: messages
        });
      });
  }
};

module.exports.getSellPage = (req, res, next) => {
  if (req.params['id']) {
    Car.findById(req.params['id'])
      .populate('seller', '-password')
      .then(car => {
        res.render('pages/store/sell', {
          title: messages.sellYourCar,
          path: '/cars/sell',
          car: car || {},
          messages: messages
        });
      });
  } else {
    res.render('pages/store/sell', {
      title: messages.sellYourCar,
      path: '/cars/sell',
      messages: messages,
      car: {seller: {}}
    });
  }
};

module.exports.addOrUpdateCarToSell = (req, res, next) => {
  let {
    make,
    model,
    year,
    src,
    price,
    description,
    carId,
  } = req.body;

  const {_id: userId} = req.session.user;

  if (userId && carId) {

    Car.findById(carId).then(car => {
      if (car.seller._id.equals(userId)) {
        car.make = make;
        car.model = model;
        car.year = year;
        car.src = src;
        car.price = price;
        car.description = description;
        car.save().then(() => {
          res.redirect('/cars/find');
        });
      } else {
        res.redirect('/cars/find');
      }
    });
  } else {

    const car = new Car({
      make: make,
      model: model,
      year: year,
      src: src,
      price: price,
      description: description,
      seller: req.user
    });
    car.save().then(() => {
      res.redirect('/cars/find');
    });
  }
}
;

module.exports.removeCar = (req, res, next) => {
  const id = req.params['id'] || "";

  if (id) {
    Car.findByIdAndDelete(id).then(() => {
      res.redirect('/cars/find');
    });
  }
};

module.exports.saveForLater = (req, res, next) => {
  const carId = req.params['id'];

  if (!carId) {
    return;
  }

  Car.findById(carId)
    .then(car => {
      // user should be the cookie we save
      return req.user.addToSaveToLater(car);
    })
    .then(result => {
      res.redirect("/cars/buy");
    });
};





module.exports.buyCar = (req, res, next) => {
  const carId = req.params['id'];
  const {_id: userId} = req.session.user;

  if (!carId && userId) {
    return;
  }

  const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY
    }
  }));

  Car.findById(carId)
    .populate('seller')
    .then(car => {
    if (userId.equals(car.seller._id)) return; // you don't want to buy your own car!

    const order = new Order({
      carId: carId,
      buyerId: userId // authenticatedUser
    });
    return order.save()
      .then(result => {

        car.status = "sold";
        car.save().then(() => {

          // send notification to seller
          transporter.sendMail({
            to: car.seller.email,
            from: "arv18001@byui.edu",
            subject: "Your car has been sold",
            html: `<h1>Congratulations! Your ${car.year} ${car.make} ${car.model} has been sold.</h1>`
          });

          // send confirmation to buyer
          transporter.sendMail({
            to: req.session.user.email,
            from: "arv18001@byui.edu",
            subject: "Thanks for buying a car on our site!",
            html: `<h1>Congratulations! Your ${car.year} ${car.make} ${car.model} is on its way.</h1>`
          });

          return res.redirect("/cars/find");
        });
      });
  });
};

