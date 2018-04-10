//DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//REQUIRES MODELS
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

//MONGOOSE ACCEPTS ES6 PROMISES
mongoose.Promise = Promise;

//STARTS EXPRESS SERVER
var app = express();

//USE BODY PARSER
app.use(bodyParser.urlencoded({
  extended: false
}));

//SETS PUBLIC AS STATIC DIR
app.use(express.static(process.cwd() + "/public"));

//CONFIGURES DATABASE
var databaseUri = "mongodb://localhost/nytarticles";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function () {
  console.log("Connected to Mongoose.");
});

//SETS ENGINE AND HANDLEBARS
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//IMPORTS ROUTES
var router = express.Router();

//REQUIRES ROUTES PASS ROUTER OBJECT
require("./config/routes")(router);

//USE ROUTER MIDDLEWARE
app.use(router);

//DEFINE PORT
var port = process.env.PORT || 3001;

//APP LISTENING...
app.listen(port, function () {
  console.log("APP RUNNING ON PORT " + port);
});