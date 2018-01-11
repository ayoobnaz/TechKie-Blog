var mongoose = require('mongoose');


var campScema = new mongoose.Schema({
    name: String, price: String, image: String, descriptions: String,
    author: {
         id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
        username: String
    },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model('yelp', campScema);
