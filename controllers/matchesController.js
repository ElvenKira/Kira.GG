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

    // Get Summoner Info
    request(options, function(error_summoner, response_summoner, data_summoner) {
        data.summoner = JSON.parse(data_summoner);
        
        options.url = config.URL_100_MATCHES_BY_ID;
        options.url = options.url.replace( "{accountId}", data.summoner.accountId);
        
        // Get latest 100 Matches
        request(options, function(error_matches, response_matches, data_matches) {
            data.matches = JSON.parse(data_matches);
            var match_count = parseInt(matches);
            var count = 0;
            var count_inside = 0;

            console.log("\n\nMatches: " + data.matches.matches.length);
            console.log("Match Count: " + match_count + "\n\n");


            // Iterate over each match and look for the match info 
            for (var i = 0; i < data.matches.matches.length && count < match_count; i++) {
                if ( data.matches.matches[i].lane.localeCompare(lane) == 0 &&
                data.matches.matches[i].queue == 420) {

                    var match_detail_option = {
                        url: config.URL_MATCH_BY_ID, 
                        headers: {
                            "X-Riot-Token": config.RIOT_KEY
                        }
                    }

                    count++;
                    match_detail_option.url = match_detail_option.url.replace( "{matchId}", data.matches.matches[i].gameId);
                    console.log(count + ": " + data.matches.matches[i].gameId);

                    get_match_detail(match_detail_option, function(err, match) {
                        if (err) {
                            console.log("Error: " + String(err));
                        } else {
                            data.match_detail[match.gameCreation] = match;
                            console.log("Added already: " + Object.keys(data.match_detail).length + " - gameCreation : " + match.gameCreation);
                            //if (++count_inside == match_count) {
                            if (Object.keys(data.match_detail).length == match_count) {
                                finish_getting_data(); 
                            }
                        }
                    })
                }
            }

            function get_match_detail(match_detail_option, callback) {
                request(match_detail_option, function(error_match, response_match, data_match) {
                    var match_obj = JSON.parse(data_match);
                    
                    if (match_obj.status !== undefined) {
                        setTimeout(function() {
                            console.log("retrying for " + Object.keys(data.match_detail).length);
                            console.log("Message: "+ JSON.stringify(match_obj));
                            console.log("URL: " + match_detail_option.url);
                            get_match_detail(match_detail_option, callback);
                        }, 1500)
                    } else {
                        console.log("on Else: " + match_obj.gameCreation);
                        callback(null, match_obj);
                    }
                });
            }

            function finish_getting_data() {
                req.app.db.collection('champions').findOne({}, function(err, data_champions) {
                    if (err) { 
                        console.log(String(err));
                    } else {
                        console.log("champions: \n" + JSON.stringify(data_champions));
                    }

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
