// We load the required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");

// //we import the controllers
var hidranteController = require('./controllers/hidrante');
 
// Create our Express application
var app = express();
 
// Connect to the mapit database (couldnt be simpler)
mongoose.connect('mongodb://localhost:27017/hidrantes',function(err,res){
if(err) {
		console.log('ERROR: connecting to Database. ' + err);
	} else {
		console.log('Connected to Database' + res);
	}
});
//mongoose.set('debug',true);
 
// Use the body-parser package in our application
// The body parser will let us parse the url-encoded http requests
// The "extended" syntax allows for rich objects and arrays to be encoded into
// the urlencoded format, allowing for a JSON-like experience with urlencoded.
app.use(bodyParser.urlencoded({
  extended: true
}));
 
app.use(bodyParser.json({
}));

// Create our router that
// will route the requests to the corresponding
// ressources
app.use(express.static('public'));

var router = express.Router();

router.route('/api/hidrantes/:sw_lat/:sw_long/:ne_lat/:ne_long/').get(hidranteController.getHidrantes); 
router.route('/api/hidrantes/:hidrante_id').get(hidranteController.getHidrante)
router.get('/', function(req,res){
	res.render("index.html");
});
  
app.use('/', router);
 
// We start the server by listening to port 3000
app.listen(process.env.PORT || 3000);
 
console.log("Our server is running wouhou!!");