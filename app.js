var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// Retrieve
var MongoClient = require('mongodb').MongoClient;
MongoClient.Promise = global.Promise;

var mongoURL = process.env.DATABASE_SERVICE_NAME || 'MONGODB';
var mongoURLLabel = "";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const config = require('./config.js');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initializes routes starting on '/'
var index = require('./routes/index');
app.use('/', index);
/*
app.use(function(req, res, next) {
  req.app.db = 
});
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log("in the err middleware");
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    IP   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "",
    databaseServiceName = process.env.DATABASE_SERVICE_NAME || 'MONGODB',
    mongoDatabase = process.env.DATABASE_NAME || 'KiraApp';

    console.log("PORT: " + PORT);
    console.log("IP: " + IP);
    console.log("mongoURL: " + mongoURL);
    console.log("databaseServiceName: " + databaseServiceName);


if (mongoURL == null && databaseServiceName) {
  console.log("Editing mongoURL");
  var mongoServiceName = databaseServiceName.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'] || 'localhost',
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'] || 27017,
      mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
      mongoUser = process.env[mongoServiceName + '_USER'];
	
	if (mongoHost && mongoPort && mongoDatabase) {
		mongoURLLabel = mongoURL = 'mongodb://';

		if (mongoUser && mongoPassword) {
			mongoURL += mongoUser + ':' + mongoPassword + '@';
		}
		
		mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
		mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
  }
}

console.log("before trying to connect");
MongoClient.connect(mongoURL, function(err, db) {
  console.log("\n\nMONGO URL: " + mongoURL);
  if (err) {
    console.log("\nError: " + String(err));
  } else {
    console.log("Connected succesfully");
    app.db = db.db(mongoDatabase);

    app.listen(PORT, () => {
      console.log("Server running on http://%s:%s", IP, PORT);
    });
  }
});


module.exports = app;