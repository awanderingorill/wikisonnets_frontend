var express = require('express');
var path = require('path');
var request = require('request');
var cookieParser = require('cookie-parser');
var wtf_wikipedia = require('wtf_wikipedia');
var async = require('async');

var app = express();
app.use(cookieParser());

app.set('views', path.join(__dirname, 'site/pages'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/search', function (req, res) {
	request({
		url: "https://en.wikipedia.org/w/api.php",
		type: 'GET',
		qs: {
			action: 'opensearch',	
			limit: '10',
			format: 'json',
			search: req.query.q
		},
	},
	function(err, response, body) {
			if(err) { console.log(err); return; }
			res.json(JSON.parse(response.body)[1]);
	});
});

app.get('/poems/:poem_id', function(req, res) {
	if (req.xhr) {
		var jar = request.jar();
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
		request({
			url: "http://localhost:8000/api/v2/poems/" + req.params['poem_id'],
			type: 'GET',
			jar: jar
		},
		function(err, response) {
			//check for tooltip query string param
			if (req.query.tooltips !== undefined) {
				//iterate through all of the lines and get the tooltipz
				var body = JSON.parse(response.body);
				//could use async parallel for this
				async.each(body.lines, function(line, callback) {
					request({
						url: "https://en.wikipedia.org/w/api.php",
						type: 'GET',
						qs: {
							action: "query",
							format: "json",
							pageids: line.page_id,
							prop: "revisions",
							rvprop: "content",
							indexpageids: true,
							redirects: true,
							// rvexpandtemplates: true
						}
					},				
					function(err, wikiResponse) {
						var body = JSON.parse(wikiResponse.body);
						console.log(body.query.pages[line.page_id.toString()].title);
						var wikitext = body.query.pages[line.page_id.toString()].revisions[0]["*"];
						var parsed = wtf_wikipedia.plaintext(wikitext);
						var start = parsed.indexOf(line.text);
						line.tooltip = {};
						if (start != -1) {
							//only want to do this if it doesn't pass the beginning or end
							var snippet = parsed.substring(start-225, start + 225).split(" ");
							if (start > 225) {
								snippet.shift();
							}
							snippet.pop();
							snippet = snippet.join(" ");
							line.tooltip.snippet = snippet;
						}
						else {
							line.tooltip.snippet = "";
						}
						line.tooltip.title = body.query.pages[line.page_id.toString()].title;
						line.tooltip.url = "https://en.wikipedia.org/wiki/" + line.tooltip.title.replace(" ", "_");
						callback();
					});
				},
				function(err) {
					res.json(body);
				});	
			}
		});
	}
	else {
		var jar = request.jar();
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
		request({
			url: "http://localhost:8000/api/v2/poems/" + req.params['poem_id'],
			type: 'GET',
			jar: jar
		},
		function(err, response) {
			if(err) { console.log(err); return; }
			var body = JSON.parse(response.body);
			console.log(response.body);
			res.render('poems/show', {lines: body.lines});
		});
	}
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('WikiSonnet frontend app listening at http://%s:%s', host, port);
});