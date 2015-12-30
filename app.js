var express = require('express');
var path = require('path');
var request = require('request');
var cookieParser = require('cookie-parser');

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
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});