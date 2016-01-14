var request = require("request");
var fs = require('fs');
// var cheerio = require("cheerio")
var htmlToText = require("html-to-text");
// var wtf_wikipedia = require("wtf_wikipedia");
// var wikifetch = require("wikifetch");

request({
	url: "https://en.wikipedia.org/w/api.php",
	type: 'GET',
	qs: {
		action: "parse",
		format: "json",
		pageid: 534366,
		prop: "text"
	},
},
function(err, response) {
	var body = JSON.parse(response.body);
	var htmlText = body.parse.text["*"];

	//$ = cheerio.load(htmlText);
	//var parsed = $("*").text();
	var parsed = htmlToText.fromString(htmlText, {wordwrap: null});
	parsed = parsed.replace(/\[\/wiki\/.*?\]/g, "");
	parsed = parsed.replace(/\[\/\/upload.*?\]/g, "");
	parsed = parsed.replace(/\[\/\/en.*?\]/g, "");
	parsed = parsed.replace(/\[\s\d*?\s\]/g, "");
	parsed = parsed.replace(/\[\sEDIT.*?\s\]/g, "");
	parsed = parsed.replace(/\[\#.*?\]/g, "");
	parsed = parsed.replace(/ +\./g, ".");
	parsed = parsed.replace(/ +\,/g, ",");
	parsed = parsed.replace(/  +/g, " ");

	
	

	fs.writeFile("obama.txt", parsed, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
	}); 
});

// wtf_wikipedia.from_api("2824759", "en", function(markup) {
// 	var obj = wtf_wikipedia.parse(markup);
// 	console.log(JSON.stringify(obj));
// });

// var w = new wikifetch.WikiFetch();
// var article;
// w.fetch("List_of_Japanese_snacks", function(err, parsedArticle) {
// 	article = parsedArticle;
// });