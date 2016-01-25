var express = require('express');
var path = require('path');
var request = require('request');
var cookieParser = require('cookie-parser');
var async = require('async');
var htmlToText = require('html-to-text');
var bodyParser = require('body-parser');

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

// app.set('views', path.join(__dirname, 'site/pages'));
app.set('views', path.join(__dirname, './src'));
app.set('view engine', 'jade');

// app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {
  res.render('index.jade');
});

app.get('/search', function (req, res) {
	request({
		url: "https://en.wikipedia.org/w/api.php",
		method: 'GET',
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

//gets information about a page
app.get('/pages/:page_id', function(req, res) {
	var page_id = req.params['page_id'];
	request({
		url: "https://en.wikipedia.org/w/api.php",
		method: 'GET',
		qs: {
			action: "query",
			format: "json",
			pageids: page_id,
			prop: "pageimages",
			pithumbsize: 150
		}
	}, 
	function(error, imageResponse) {
		var body = JSON.parse(imageResponse.body);
		var key = Object.keys(body.query.pages)[0]
		if (body.query.pages[key].thumbnail) {
			var imageUrl = body.query.pages[key].thumbnail.source;
		}
		else {
			var imageUrl = "";
		}
		res.json({page_id: page_id, imageUrl: imageUrl});
	});
});

app.post('/poems', function(req, res) {
	var jar = request.jar();
	if (req.cookies["session"]) {
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
	}

	request({
		url: "http://localhost:8000/api/v2/poems",
		method: 'POST',
		jar: jar,
		form: {
			poemTitle: req.body.poemTitle
		}
	},
	function(err, poemResponse) {
		if (err) {console.log(err); return;}
		if (!req.cookies["session"]) {
			var cookies = jar.getCookies('http://localhost:3000');
			res.cookie(cookies[0]);
		}
		var body = JSON.parse(poemResponse.body);
		async.each(body.lines, function(line, callback) {
			fetchTooltip(line, function() {
				callback();
			});
		},
		function(err) {
			res.json(body);
		});
	});
});

app.post('/poems/:poem_id', function(req, res) {
	var oldPoem = req.body.poem;
	var jar = request.jar();
	if (req.cookies["session"]) {
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
	}

	request({
		url: "http://localhost:8000/api/v2/poems/" + req.params["poem_id"],
		method: 'GET',
		jar: jar
	},
	function(err, poemResponse) {
		if (err) {console.log(err); return; }
		if (!req.cookies["session"]) {
			var cookies = jar.getCookies('http://localhost:3000');
			res.cookie(cookies[0]);
		}
		var body = JSON.parse(poemResponse.body);
		//combine body with old poem;
		async.forEachOf(body.lines, function(line, index, callback) {
			if (oldPoem.lines && parseInt(oldPoem.lines[index].page_id) !== 0) {
				line.tooltip = oldPoem.lines[index].tooltip;
				callback();
			}
			else {
				fetchTooltip(line, function() {
					callback();
				});
			}
		},
		function(err) {
			res.json(body);
		});
	});

});

app.get('/poems/:poem_id', function(req, res) {
	var jar = request.jar();
	if (req.cookies["session"]) {
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
	}

	request({
		url: "http://localhost:8000/api/v2/poems/" + req.params['poem_id'],
		method: 'GET',
		jar: jar
	},
	function(err, response) {
		if(err) { console.log(err); return; }
		if (!req.cookies["session"]) {
			var cookies = jar.getCookies('http://localhost:3000');
			res.cookie(cookies[0]);
		}
		var body = JSON.parse(response.body);
		async.parallel([
			function(cb) {
				fetchPoemImage(body, cb);
			},
			function(cb) {
				async.forEachOf(body.lines, function(line, index, callback) {
					fetchTooltip(line, function() {
						callback();
					});
				},
				function(err) {
					cb();
				});
			}
		],
		function(err) {
			res.render('poems/show', {poem: body});
		});
	});
});

app.post('/poems/:poem_id/lauds', function(req, res) {
	var jar = request.jar();
	if (req.cookies["session"]) {
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
	}

	request({
		url: "http://localhost:8000/api/v2/poems/" + req.params['poem_id'] + "/lauds",
		method: 'POST',
		jar: jar
	},
	function(err, response) {
		if (!req.cookies["session"]) {
			var cookies = jar.getCookies('http://localhost:3000');
			res.cookie(cookies[0]);
		}	
		res.json(JSON.parse(response.body));
	});

});

app.delete('/poems/:poem_id/lauds', function(req, res) {
	var jar = request.jar();
	if (req.cookies["session"]) {
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
	}

	request({
		url: "http://localhost:8000/api/v2/poems/" + req.params['poem_id'] + "/lauds",
		method: 'DELETE',
		jar: jar
	},
	function(err, response) {
		if (!req.cookies["session"]) {
			var cookies = jar.getCookies('http://localhost:3000');
			res.cookie(cookies[0]);
		}	
		res.json(JSON.parse(response.body));
	});

});

function fetchPoemImage(poem, callback) {
	var page_id = poem.starting_page;
	request({
		url: "https://en.wikipedia.org/w/api.php",
		method: 'GET',
		qs: {
			action: "query",
			format: "json",
			pageids: page_id,
			prop: "pageimages",
			pithumbsize: 150
		}
	}, 
	function(error, imageResponse) {
		var body = JSON.parse(imageResponse.body);
		var key = Object.keys(body.query.pages)[0]
		if (body.query.pages[key].thumbnail) {
			var imageUrl = body.query.pages[key].thumbnail.source;
		}
		else {
			var imageUrl = "";
		}
		poem.imageUrl = imageUrl;
		callback();
	});
}

function fetchTooltip(line, callback) {
	console.log(line);
	if (parseInt(line.page_id) !== 0) {
		request({
			url: "https://en.wikipedia.org/w/api.php",
			method: 'GET',
			qs: {
				action: "parse",
				format: "json",
				pageid: line.page_id,
				prop: "text",
				oldid: line.revision || 1
			}
		},
		function(err, wikiResponse) {
			var body = JSON.parse(wikiResponse.body);
			if (body.error) {
				line.tooltip = {};
				line.tooltip.snippet = "";
				line.tooltip.url = "";
				line.tooltip.title = "";
				callback();
				return;
			}
			var htmlText = body.parse.text["*"];
			var parsed = htmlToText.fromString(htmlText, {wordwrap: null});
			parsed = parsed.replace(/\[\/wiki\/.*?\]/g, "");
			parsed = parsed.replace(/\[\/\/upload.*?\]/g, "");
			parsed = parsed.replace(/\[\/\/en.*?\]/g, "");
			parsed = parsed.replace(/\[\s\d*?\s\]/g, "");
			parsed = parsed.replace(/\[\sEDIT.*?\s\]/g, "");
			parsed = parsed.replace(/\[http\:\/\/.*?\]/g, "");
			parsed = parsed.replace(/\[\#.*?\]/g, "");
			parsed = parsed.replace(/ +\./g, ".");
			parsed = parsed.replace(/ +\,/g, ",");
			parsed = parsed.replace(/  +/g, " ");
			parsed = parsed.replace(/\n\n\n+/g, "\n\n");
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
			line.tooltip.title = body.parse.title;
			line.tooltip.url = "https://en.wikipedia.org/wiki/" + line.tooltip.title.replace(" ", "_");
			callback();	
		});		
	} 
	else {
		line.tooltip = {};
		line.tooltip.snippet = "";
		line.tooltip.url = "";
		line.tooltip.title = "";
		callback();
	}	
}

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('WikiSonnet frontend app listening at http://%s:%s', host, port);
});