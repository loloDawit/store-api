const mongoose = require('mongoose');
const match = require('nodemon/lib/monitor/match');
const { stringify } = require('nodemon/lib/utils');
const storeSchema = new mongoose.Schema({
  storeNo: {
    type: String,
    required: [true, 'Enter the store number '],
  },
  storeName: {
      type : String,
      required : [true, 'Provide strore name'],
      maxlength : [ 15, 'maximum 15 char'],
  },
  contact: {
      tie_line: {
          type : String ,
          maxlength : [15, 'Number should not exceed 15 char'],

      },
      phone :{
          type : String,
          match :[ /\d(3)- \d(3)-\d(4)/ ],
      },
  }
});
