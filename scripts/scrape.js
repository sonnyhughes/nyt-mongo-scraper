//DEPENDENCIES
var request = require("request");
var cheerio = require("cheerio");

//SCRAPE ARTICLES FROM FRONT PAGE OF NEW YORK TIMES
var scrape = function (callback) {

    var articlesArr = [];

    request("https://www.nytimes.com/", function (error, response, html) {

        var $ = cheerio.load(html);

        $("h2.story-heading").each(function (i, element) {

            var result = {};

            //ADD THE TEXT AND LINK OF EVERY ARTICLE AND SAVE THEM AS PROPS OF result OBJECT
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            if (result.title !== "" && result.link !== "") {
                articlesArr.push(result);
            }
        });
        callback(articlesArr);
    });

};

module.exports = scrape;