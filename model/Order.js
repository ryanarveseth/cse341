const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  carId: {type: Schema.Types.ObjectId, ref: 'Car', required: true},
  buyerId: {type: Schema.Types.ObjectId, ref: 'Seller', required: true},
});

module.exports = mongoose.model('Order', orderSchema);