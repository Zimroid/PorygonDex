// config serveur
var express		= require('express');
var morgan		= require('morgan');
var bodyParser	= require('body-parser');
var app			= express();
var mongoose	= require('mongoose');

//Laisse Heroku configurer le port
var port = process.env.PORT || 8080;
var options = {
	user:process.env.USER_BDD,
	pass:process.env.PASSWORD_BDD
};

mongoose.connect(process.env.BDD, options);

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev'));
app.use(bodyParser()); 							// pull information from html in POST

require('./app/routes.js')(app);

app.listen(port);

console.log("App listening on port " + port);