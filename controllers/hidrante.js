// We load the Location model
var Hidrante = require('../models/hidrante');
var mongoose = require('../node_modules/mongoose');

// Create endpoint /api/hidrantes for GET
exports.getHidrantes = function(req, res) {
    // Use the Location model to find all locations
    // from particular user with their username
    Hidrante.find({
    	"loc":{
    		$geoWithin:{
    			$box:[
    				[req.params.sw_lat, req.params.sw_long],
    				[req.params.ne_lat, req.params.ne_long]
    			]
    		}
    	},
        "estado": "Operativo",
        "propiedad": "PÚBLICO"
    }).lean().exec(function(err, hidrantes) {
        if(err){
            res.send(err);
            return;
        }
        res.json(hidrantes);
        return;
    });
};

// Create endpoint /api/hidrantes/:hidrante_id for GET
exports.getHidrante = function(req, res) {
    // Use the Location model to find a specific location
    Hidrante.find({
        id:req.params.hidrante_id
    }, function(err, hidrante) {
        if (err)
            res.send("error" + err);
        res.json(hidrante);
    });
};