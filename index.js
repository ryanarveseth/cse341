/*******************************************************************************
 * Feel free to remove this comment block and all other comments after pulling.
 * They're for information purposes only.
 *
 * This layout is provided to you for an easy and quick setup to either pull
 * or use to correct yours after working at least 1 hour on Team Activity 02.
 * Throughout the course, we'll be using Express.js for our view engines.
 * However, feel free to use pug or handlebars ('with extension hbs'). You will
 * need to make sure you install them beforehand according to the reading from
 * Udemy course.
 * IMPORTANT: Make sure to run "npm install" in your root before "npm start"
 *******************************************************************************/
// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const Seller = require('./model/Seller');
const csrf = require('csurf');
const flash = require('connect-flash');
const messages = require('./model/messages');

require('dotenv').config();

const cors = require('cors');
const corsOptions = {
  origin: "https://<your_app_name>.herokuapp.com/",
  optionsSuccessStatus: 200
};

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

const MONGODB_URL = process.env.MONGODB_URL;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions',
  expires: process.env.EXPIRES || 1000 * 60 * 15
});

const csrfProtection = csrf();

// Route setup. You can implement more in the future!
const ta01Routes = require('./routes/ta01');
const ta02Routes = require('./routes/ta02');
const ta03Routes = require('./routes/ta03');
const ta04Routes = require('./routes/ta04');
const storeRoutes = require('./routes/store');
const loginRoutes = require('./routes/store/loginRoutes');
const avengersRoutes = require('./routes/avengersRoutes');

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser({extended: false}))
  .use(cors(corsOptions))
  .use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}))
  .use(csrfProtection)
  .use(flash())
  .use('/ta01', ta01Routes)
  .use('/ta02', ta02Routes)
  .use('/ta03', ta03Routes)
  .use('/ta04', ta04Routes)
  .use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();

    if (req.session && req.session.user) {
      Seller.findById(req.session.user._id).then(user => {
        req.user = user;
        res.locals.user = req.session.user;
        next();
      });
    } else {
      res.locals.user = {};
      next();
    }
  })
  .use('/', loginRoutes)
  .use('/', storeRoutes)
  .use('/avengers', avengersRoutes)
  .use((req, res, next) => {
    // 404 page
    res.render('pages/store/404', {title: '404 - Page Not Found', path: req.url, messages: messages})
  })
  .get('/home', (req, res, next) => {
    res.render('pages/index', {title: 'Welcome to my CSE341 repo', path: '/'});
  })
  .use((req, res, next) => {
    res.render('pages/404', {title: '404 - Page Not Found', path: req.url})
  });

mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });

