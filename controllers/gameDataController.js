var request = require('request');
var config = require('../config');
const keys = require('../config/keys');

exports.download_game_data = function(req, res, next) {
    var options = {
        url: 'https://la2.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+ summoner, 
        headers: {
            "X-Riot-Token": keys.RIOT_KEY
        }
    }
    var db = req.app.locals.db;
    db.collection("test").find({}, function(err, docs) {
        console.log("On summoner.js: " + docs.test_val);
    });

    request(options, function(error, response, body) {
        console.log(body);
        res.render('summoner_data', {'data': JSON.parse(body)});
    });
}

exports.summoner_get_name = function(req, res, next) {
    res.render('index');
}
