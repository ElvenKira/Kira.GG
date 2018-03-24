var request = require('request');
var config = require('../config');

exports.matches_get_data_by_name = function(req, res, next) {
    //var summoner = req.params.summoner_name;
    var summoner = req.body.summoner_name;
    var lane = req.body.lane;
    var role = req.body.role;
    var matches = req.body.matches;
    
    console.log(summoner);
    console.log("test: " + config.URL_SUMMONER_BY_NAME + summoner);
    var options = {
        url: config.URL_SUMMONER_BY_NAME + summoner, 
        headers: {
            "X-Riot-Token": config.RIOT_KEY
        }
    }

    var data = {};
    data.match_detail = {};

    request(options, function(error_summoner, response_summoner, data_summoner) {
        data.summoner = JSON.parse(data_summoner);
        options.url = config.URL_100_MATCHES_BY_ID;
        options.url = options.url.replace( "{accountId}", data.summoner.accountId);
        //console.log("options.url after replace: " + options.url);
        
        request(options, function(error_matches, response_matches, data_matches) {
            data.matches = JSON.parse(data_matches);
            var match_count = parseInt(matches);
            var count = 0;
            var count_inside = 0;

            console.log("\n\nMatches: " + data.matches.matches.length + "\n\n");
            // Iterate over each match and look for the match info
            for (var i = 0; i < data.matches.matches.length; i++) {
                if ( data.matches.matches[i].lane.localeCompare(lane) == 0 &&
                     data.matches.matches[i].queue == 420 && 
                     count < match_count) {

                    count++;
                    options.url = config.URL_MATCH_BY_ID;
                    options.url = options.url.replace( "{matchId}", data.matches.matches[i].gameId);

                    get_match_detail(options, function(err, match) {
                        if (err !== null) {
                            data.match_detail[match.gameCreation] = match;
                            if (++count_inside == match_count) {
                                console.log("Keys inside: " + Object.keys(data.match_detail).length);
                                finish_getting_data(); 
                            }
                        }
                    })
                }
            }
            
            function get_match_detail(options, callback) {
                request(options, function(error_match, response_match, data_match) {
                    var match_obj = JSON.parse(data_match);
                    if (match_obj.status !== undefined) {
                        console.log("retrying for " + count_inside);
                        get_match_detail(options, callback);
                    } else {
                        callback(null, match_obj);
                    }
                    callback(error_match, null);
                });
            }

            function finish_getting_data() {
                req.app.db.collection('champions').findOne({}, function(err, data_champions) {
                    res.render('matches_data', 
                        {
                            'data': data,
                            'champions' : data_champions,
                            'matches': match_count
                        });
                });
            }

        });
    });
}

exports.summoner_get_name = function(req, res) {
    res.render('index');
}
