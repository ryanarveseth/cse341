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
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const messages = require('./model/messages');

require('dotenv').config();

const cors = require('cors');
const corsOptions = {
  origin: "https://<your_app_name>.herokuapp.com/",
  optionsSuccessStatus: 200
};

const MONGODB_URL = process.env.MONGODB_URL;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions',
  expires: process.env.EXPIRES || 1000 * 60 * 15
});

// Route setup. You can implement more in the future!
const proveRoutes = require('./routes/prove12');

app.use(express.static(path.resolve(__dirname, '../ui/build')))
  .use(bodyParser({extended: false}))
  .use(cors(corsOptions))
  .use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}))
  .use(flash())
  .use('/api', proveRoutes)
  .use((req, res, next) => {
    res.render('pages/404', {title: '404 - Page Not Found', path: req.url, messages: messages})
  });

const server = app.listen(PORT)

const io = require('socket.io')(server);

io.on('connection', socket => {

  socket
    .on("disconnect", () => {

    })
    .on("new-user", (username, time) => {
      const message = `${username} has entered the chat.`;

      socket.broadcast.emit("new-message", {
        message,
        time,
        from: "ChatterBot"
      });
    })
    .on("new-count", (count) => {
      socket.broadcast.emit("new-user-count", count);
    })
    .on("new-chat", (message) => {
      socket.broadcast.emit("new-message", {...message});
    });
})