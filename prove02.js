const express = require('express');
const app = express();
const prove02Routes = require("./routes/prove02");
const path = require("path");
const bodyParser = require('body-parser');

app.listen(process.env.PORT || 3000);

app
  .use(bodyParser({extended: false}))
  .use(express.static(__dirname + '/public'))
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))
  .use(prove02Routes);
