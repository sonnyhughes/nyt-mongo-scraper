//DEPENDENCIES
var mongoose = require("mongoose");
//CREATES SCHEMA CLASS
var Schema = mongoose.Schema;

//CREATES NOTE SCHEMA
var NoteSchema = new Schema({
  //BODY IS STRING
  body: {
    type: String
  }
});

//CREATES Note MODEL
var Note = mongoose.model("Note", NoteSchema);

//EXPORT THE Note MODEL
module.exports = Note;