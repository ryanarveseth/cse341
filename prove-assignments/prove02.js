const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const users = [];

const routes = require('./routes/prove02');

app.use(bodyParser.urlencoded({extended: false}));
app.use(routes);

app.use((req, res) => {
  res.status(404)
    .send('<h1>404 - Not Found</h1>')
});

app.use(express.static(path.join(__dirname, 'stylesheets','prove02.css')));

app.listen(3000);
