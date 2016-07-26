var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

// Middleware to parse the data sent by the browser to the server.
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

// The route for the home page.
app.get('/', function (req, res) {

	if (!req.session.logged_in) {
		res.redirect('/login');
	} else {
		res.send('<p>You are logged in.</p><br><a href="/logout">Logout</a>');
	}
});

// The route for the login page.
app.get('/login', function (req, res) {
	// Send the login HTML file to the client (browser).
	res.sendFile(__dirname + '/views/login.html');
});

var logins = [
	{
		username: 'test',
		password: 'test'
	},
	{
		username: 'test2',
		password: 'test2'
	}
];

// The route for the login form submission.
app.post('/login', function (req, res) {

	var allowed = false;

	// Normally, this would be done by checking the user information which is stored in a database.
	// For simplicity, we did things this way (the wrong way).
	logins.forEach(function(login) {
		if (
			login.username === req.body.username &&
			login.password === req.body.password
		) {
			allowed = true;
		}
	});

	if (!allowed) {
		return res.redirect('/login?error=wrong_login');
	}

	// They are allowed.

	// We set a session variable here, so that we know the session is authenticated.
	req.session.logged_in = true;
	res.redirect('/');
});

// The route for logging out.
app.get('/logout', function(req, res) {

	// Should always regenerate a session when changing authenticated state of a session (login/logout).
	req.session.regenerate(function(error) {
		res.redirect('/login');
	});
});

// Tell the express app to start listening for HTTP requests on port 3000.
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

// This catches errors from middleware and routes.
// We don't want to send full error stack traces to the client (browser).
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});
