//DEPENDENCIES
var scrape = require("../scripts/scrape");
var Article = require("../models/Article");

module.exports = {
  fetch: function (callback) {

    scrape(function (data) {

      var articlesArr = data;
      //ENSURES EACH ARTICLE OBJECT DOES NOT SAVE BY DEFAULT
      for (var i = 0; i < articlesArr.length; i++) {
        articlesArr[i].date = new Date();
        articlesArr[i].saved = false;
        articlesArr[i].note = [];
      }

      //FILTERS THE DUPLICATE ARTICLES (ARTICLE MODEL DEMANDS UNIQUE ENTRIES)
      Article.collection.insertMany(articlesArr, {
        ordered: false
      }, function (err, docs) {
        callback(err, docs);
      });
    });
  },
  get: function (query, cb) {
    //QUERY IS HARDCODED TO TRUE
    Article.find(query)
      .sort({
        _id: -1
      })
      .exec(function (err, doc) {
        //SEND SAVED ARTICLES BACK TO ROUTES
        cb(doc);
      });
  },
  update: function (query, cb) {
    //SAVE OR UNSAVES ARTICLE BASED ON USER QUERY
    Article.update({
      _id: query.id
    }, {
      $set: {
        saved: query.saved
      }
    }, {}, cb);
  },
  addNote: function (query, cb) {
    Article.findOneAndUpdate({
      _id: query.id
    }, {
      $push: {
        note: query.note
      }
    }, {}, cb);
  }
};