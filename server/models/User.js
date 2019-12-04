var mongoose = require('mongoose');
const { Schema } = mongoose;

var postSchema = new Schema({
  firstName:  {
    type: String
  },
  lastName: {
    type: String
  }
});

mongoose.model('User', postSchema);