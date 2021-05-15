const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
  make: {type: String, required: true},
  model: {type: String, required: true},
  year: {type: Number, required: true},
  src: {type: String, required: true},
  price: {type: Number, required: true},
  description: String,
  seller: {type: Schema.Types.ObjectId, ref: 'Seller', required: true},
});

module.exports = mongoose.model('Car', carSchema);