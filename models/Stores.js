const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  storeNo: {
    type: String,
    required: [true, 'Enter the store number '],
    maxlength: [5, 'Store number can not be more than 5 char'],
  },
  storeName: {
    type: String,
    required: [true, 'Provide strore name'],
    maxlength: [15, 'maximum 15 char'],
  },
  contact: {
    tie_line: {
      type: String,
      maxlength: [15, 'Number should not exceed 15 char'],
    },
    phone: {
      type: String,
      match: [/\d(3)- \d(3)-\d(4)/, 'Please provide phone numnber.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    image: {
      type: String,
      default: 'test.image.jpg',
    },
  },
});

module.exports = mongoose.model('StoreData', StoreSchema);
