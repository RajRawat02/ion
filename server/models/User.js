var mongoose = require('mongoose');
const { Schema } = mongoose;

var postSchema = new Schema({
  ts:  {
    type: Number
  },
  val: {
    type: Number
  }
});

mongoose.model('User', postSchema);
