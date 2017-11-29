var express = require('express');
http = require('http');
var bodyParser = require('body-parser');
app = express();
var engines = require('consolidate');
var url = require('url');
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.use(express.static('public'))
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({  extended: true }));

http.createServer(app).listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

app.get('/', function(request, response) {
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
  	response.render('pages/launch.html');
});

app.get('/checkout', function(request, response) {
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;
  	response.render('pages/checkout.html');
});
