const express = require('express');
const app = express();
const prove02Routes = require("./routes/prove02");
const path = require("path");

app.listen(process.env.port || 3000);

app
  .use(express.static(__dirname + '/public'))
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))
  .use(prove02Routes);
