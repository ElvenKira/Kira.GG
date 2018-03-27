var request = require('request');
var config = require('../config');
const keys = require('../config/keys');

exports.summoner_get_data_by_name = function(req, res, next) {
    //var summoner = req.params.summoner_name;
    var summoner = req.body.summoner_name;
    
    console.log(summoner);
    console.log("test: " + config.URL_SUMMONER_BY_NAME + summoner);
    var options = {
        url: config.URL_SUMMONER_BY_NAME + summoner, 
        headers: {
            "X-Riot-Token": keys.RIOT_KEY
        }
    }

    var data = {};

    request(options, function(error_summoner, response_summoner, data_summoner) {
        data.summoner = JSON.parse(data_summoner);
        console.log(data_summoner);
        options.url = config.URL_GET_CHAMPION_MASTERY;
        options.url = options.url.replace( "{summonerId}", data.summoner.id);
        //console.log("options.url after replace: " + options.url);
        
        request(options, function(error_mastery, response_mastery, data_mastery) {
            data.mastery = JSON.parse(data_mastery);
            console.log(JSON.stringify(data));

            console.log("req.app.db: " + req.app.db );
            req.app.db.collection('champions').find({}, function(err, data_champions) {
                data.champions = JSON.parse(data_champions);
                res.render('summoner_data', {'data': data});
            });
        });
    });
}

exports.summoner_get_name = function(req, res) {
    res.render('index');
}
