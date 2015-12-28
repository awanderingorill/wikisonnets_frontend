var express = require('express');
var path = require('path');
var app = express();
var request = require('request');

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

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});