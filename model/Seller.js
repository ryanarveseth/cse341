const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},
  savedForLater: [
    { carId: {type: Schema.Types.ObjectId, ref: 'Car'} }
  ],
  password: {type: String, required: true}
});


sellerSchema.methods.addToSaveToLater = (carToAdd) => {
  let updatedSaveForLater = [];
  if (this.savedForLater) {
    const savedForLaterIndex = this.savedForLater.findIndex(car => car.carId.equals(carToAdd._id));
    if (savedForLaterIndex >= 0) {
      // You can't save the same car twice!
      return;
    }
    updatedSaveForLater = [...this.savedForLater];
    updatedSaveForLater.push({carId: carToAdd._id});
  } else {
    updatedSaveForLater = [carToAdd];
  }


  this.savedForLater = updatedSaveForLater;

  return this.save();
}


sellerSchema.methods.removeFromSaveForLater = (carToRemove) => {
  this.savedForLater = {
    cars: this.savedForLater.filter(car => car.carId._id === carToRemove._id)
  }

}

module.exports = mongoose.model('Seller', sellerSchema);