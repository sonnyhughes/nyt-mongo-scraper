//DEPENDENCIES
var mongoose = require("mongoose");
//CREATES SCHMA CLASS
var Schema = mongoose.Schema;

//CREATES ARTICLE SCHEMA
var ArticleSchema = new Schema({
  //TITLE IS REQUIRED STRING
  title: {
    type: String,
    required: true,
    unique: true
  },
  //HYPERLINK IS REQUIRED STRING
  link: {
    type: String,
    required: true
  },
  date: String,
  saved: {
    type: Boolean,
    default: false
  },
  //SAVES NOTES' ObjectID
  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

//CREATES Article MODEL WITH THE ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

//EXPORTS MODEL
module.exports = Article;