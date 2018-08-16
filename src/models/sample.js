const mongoose   = require('mongoose');
Schema           = mongoose.Schema;

let SampleSchema = new Schema({
  test: {
    type: String,
  }
});

module.exports   = mongoose.model('Sample', SampleSchema);
