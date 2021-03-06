var express = require('express');
var path = require('path');
var request = require('request');
var cookieParser = require('cookie-parser');
var async = require('async');
var htmlToText = require('html-to-text');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var url = require("url");

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.use(favicon(path.join(__dirname,'/dist/images/favicon.ico')));

// app.set('views', path.join(__dirname, 'site/pages'));
app.set('views', path.join(__dirname, './src'));
app.set('view engine', 'jade');

// app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {
  res.render('index.jade');
});

app.get('/about', function (req, res) {
  res.render('index.jade');
});

app.get('/api/search', function (req, res) {
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
			res.json(JSON.parse(response.body)[1].map(function(title) {
				return {title: title}
			}));
	});
});

//gets information about a page
//probably here will get all of the poems for a 
//give page as well
app.get('/api/pages/:page_id/image', function(req, res) {
	var page_id = req.params['page_id'];
	request({
		url: "https://en.wikipedia.org/w/api.php",
		method: 'GET',
		qs: {
			action: "query",
			format: "json",
			pageids: page_id,
			prop: "pageimages",
			pithumbsize: 300
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
		res.json(imageUrl);
	});
});

app.post('/api/poems', function(req, res) {
	var jar = request.jar();
	if (req.cookies["session"]) {
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
	}

	console.log(req.body.poemTitle);
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
		res.json(body);
	});
});

app.get('/api/poems', function(req, res) {
	var jar = request.jar();
	if (req.cookies["session"]) {
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
	}
	console.log(req.query);
	request({
		url: "http://localhost:8000/api/v2/poems",
		method: 'GET',
		jar: jar,
		qs: req.query
	},
	function(err, response) {
		var body = JSON.parse(response.body);
		res.json(body.poems);
	});
});

app.get('/poems/:poem_id', function(req, res) {
	if (req.query.status === "404") {
		res.status(404).render('index.jade');
	}
	else {
		res.render('index.jade');
	}
});

app.get('/api/poems/:poem_id', function(req, res) {
	var jar = request.jar();
	if (req.cookies["session"]) {
		var cookie = request.cookie("session="+req.cookies["session"]);
		jar.setCookie(cookie, 'http://localhost:3000');
	}

	request({
		url: "http://localhost:8000/api/v2/poems/" + req.params['poem_id'],
		method: 'GET',
		jar: jar,
		qs: req.query
	},
	function(err, response) {
		if(err) { console.log(err); return; }
		if (response.statusCode === 404) {
			res.status(404).send('Not found');
			return;
		}
		if (!req.cookies["session"]) {
			var cookies = jar.getCookies('http://localhost:3000');
			res.cookie(cookies[0]);
		}
		var body = JSON.parse(response.body);
		fetchPoemImage(body.starting_page, function(imageUrl) {
			body.imageUrl = imageUrl;
			res.json(body);
		});
	});
});

app.get('/api/pages/:page_id/tooltip', function(req, res) {
	var revisionId = req.query.revisionId || 1;
	var line = req.query.line;
	var pageId = req.params.page_id;

	request({
		url: "https://en.wikipedia.org/w/api.php",
		method: 'GET',
		qs: {
			action: "parse",
			format: "json",
			prop: "text",
			oldid: revisionId
		}
	},
	function(err, wikiResponse) {
		if (err) {
			res.json({});
			return;
		}
		var body = JSON.parse(wikiResponse.body);
		if (body.error || !body.parse) { 
			res.json({}); 
			return;
		}
		
		var htmlText = body.parse.text["*"];
		var parsed = htmlToText.fromString(htmlText, {wordwrap: null});
		parsed = parsed.replace(/\[\/wiki\/.*?\]/g, "");
		parsed = parsed.replace(/\[\/w\/.*?\]/g, "");
		parsed = parsed.replace(/\[\/\/upload.*?\]/g, "");
		parsed = parsed.replace(/\[\/\/en.*?\]/g, "");
		parsed = parsed.replace(/\[\s\d*?\s\]/g, "");
		parsed = parsed.replace(/\[\sEDIT.*?\s\]/g, "");
		parsed = parsed.replace(/\[http\:\/\/.*?\]/g, "");
		parsed = parsed.replace(/\[\#.*?\]/g, "");
		parsed = parsed.replace(/ +\./g, ".");
		parsed = parsed.replace(/ +\,/g, ",");
		parsed = parsed.replace(/  +/g, " ");
		parsed = parsed.replace(/\n +/g, "\n");
		parsed = parsed.replace(/\n\n\n+/g, "\n\n");
		
		var start = parsed.indexOf(line);
		var tooltip = {};
		if (start != -1) {
			var snippet = parsed.substring(start-110, start + 130).split(" ");
			if (start > 110) {
				snippet.shift();
			}
			snippet.pop();
			snippet = snippet.join(" ");
			tooltip.snippet = snippet;
		}
		else {
			tooltip.snippet = "";
		}

		if (start != -1) {
			var mobileSnippet = parsed.substring(start-60, start + 90).split(" ");
			if (start > 60) {
				mobileSnippet.shift();
			}
			mobileSnippet.pop();
			mobileSnippet = mobileSnippet.join(" ");
			tooltip.mobileSnippet = mobileSnippet;
		}
		else {
			tooltip.mobileSnippet = "";
		}
		tooltip.title = body.parse.title;
		tooltip.url = "https://en.wikipedia.org/wiki/" + tooltip.title.replace(" ", "_");
		res.json(tooltip);
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

// Handle 404
app.use(function(req, res) {
	res.redirect('/poems/538?status=404');
	// res.status(404).send('404: Page not Found');
});

// Handle 500
app.use(function(error, req, res, next) {
	res.status(500).send('500: Internal Server Error');
});

function fetchPoemImage(pageId, callback) {
	var page_id = pageId;
	console.log(page_id);
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
		if (error) {
			console.log(error);
			callback("");
		} else {
			var body = JSON.parse(imageResponse.body);
			var key = Object.keys(body.query.pages)[0]
			if (body.query.pages[key].thumbnail) {
				var imageUrl = body.query.pages[key].thumbnail.source;
			}
			else {
				var imageUrl = "";
			}
			callback(imageUrl);
		}
	});
}

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('WikiSonnet frontend app listening at http://%s:%s', host, port);
});