//DEPENDENCIES
var scrape = require("../scripts/scrape");
var Article = require("../models/Article");
var Note = require("../models/Note");
var articlesController = require("../controllers/articles");
var notesController = require("../controllers/notes");

module.exports = function (router) {

    //ROOT ROUTE
    router.get("/", function (req, res) {
        Article.find({
            saved: false
        }, function (error, found) {
            if (error) {
                console.log(error);
            } else if (found.length === 0) {
                res.render("empty")
            } else {

                var hbsObject = {
                    articles: found
                };
                res.render("index", hbsObject);
            }
        });
    });

    router.get("/api/fetch", function (req, res) {

        //SCRAPES ARTICLES AND SAVES EACH TO DB
        articlesController.fetch(function (err, docs) {
            //ALERTS USER
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "Scrape Completed."
                });
            } else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });

            }
        });
    });

    //FETCHES SAVED ARTICLES
    router.get("/saved", function (req, res) {

        articlesController.get({
            saved: true
        }, function (data) {
            var hbsObject = {
                articles: data
            };
            res.render("saved", hbsObject);
        });
    });

    //TO SAVE OR NOT TO SAVE, THAT IS THE QUESTION
    router.patch("/api/articles", function (req, res) {
        articlesController.update(req.body, function (err, data) {
            res.json(data);
        });
    });

    //RETRIEVES NOTES ATTACHED TO SAVED ARTICLES
    router.get('/notes/:id', function (req, res) {
        //FIND MATCHING ID
        Article.findOne({
                _id: req.params.id
            })
            //POPULATE NOTES ASSOCIATED WITH ID
            .populate("note")
            .exec(function (error, doc) {
                if (error) console.log(error);
                else {
                    res.json(doc);
                }
            });
    });

    //ADDS NOTE TO SAVED ARTICLE Add a note to a saved article
    router.post('/notes/:id', function (req, res) {
        //CREATES NEW NOTE WTIH req.body
        var newNote = new Note(req.body);
        //SAVE newNote TO THE DATABASE
        newNote.save(function (err, doc) {
            if (err) console.log(err);
            //FINDS AND UPDATES NOTE
            Article.findOneAndUpdate({
                    //FINDS _id VIA req.params.id
                    _id: req.params.id
                },
                //PUSHES TO THE NOTES ARRAY
                {
                    $push: {
                        note: doc._id
                    }
                }, {
                    new: true
                },
                function (err, newdoc) {
                    if (err) console.log(err);
                    res.send(newdoc);
                });
        });
    });

    //DELETES ARTICLE
    router.get('/deleteNote/:id', function (req, res) {
        Note.remove({
            "_id": req.params.id
        }, function (err, newdoc) {
            if (err) console.log(err);
            res.redirect('/saved'); //REDIRECT RELOADS PAGE
        });
    });

};