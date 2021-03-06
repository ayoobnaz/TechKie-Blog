var mongoose = require('mongoose');


var ArticleScema = new mongoose.Schema({
    name: String, price: String, image: String, descriptions: String,
    dateN:{type: Date , default: Date.now},
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

module.exports = mongoose.model('mainDbs', ArticleScema);
