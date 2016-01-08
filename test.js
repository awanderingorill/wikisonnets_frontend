var request = require("request");
// var txtwiki = require("./site/scripts/txtwiki.js")
var wtf_wikipedia = require("wtf_wikipedia")

request({
	url: "https://en.wikipedia.org/w/api.php",
	type: 'GET',
	qs: {
		action: "query",
		format: "json",
		pageids: 9273854,
		prop: "revisions",
		rvprop: "content",
		indexpageids: true,
		redirects: true,
		// rvexpandtemplates: true
	},
},
function(err, response) {
	var body = JSON.parse(response.body);
	var wikitext = body.query.pages["9273854"].revisions[0]["*"];
	
	//var parsed = txtwiki.parseWikitext(wikitext);
	var parsed = wtf_wikipedia.plaintext(wikitext);
	console.log(parsed);
	//console.log(wikitext);

	// var index = parsed.indexOf("The Clinton camp continued to suggest");
	// console.log(parsed.substring(index-100, index+100));
	//console.log(body.query.pages["9273854"].title)
});