const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comment = new Schema({
  subject: {type: String, required: true},
  body: {type: String, required: true},
  email: {type: String, required: true}
});

module.exports = mongoose.model('Comment', comment);