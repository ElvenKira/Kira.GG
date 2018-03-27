var request = require('request');
var config = require('../config');
const keys = require('../config/keys');
const RIOT_KEY = process.env.RIOT_KEY || keys.RIOT_KEY;

exports.matches_get_data_by_name = function(req, res, next) {
    //var summoner = req.params.summoner_name;
    var summoner = req.body.summoner_name;
    var lane = "";
    var role = "";

    switch(req.body.role) {
        case "ADC":
            lane = "BOTTOM";
            role = "DUO_CARRY";
            break;
        case "Support":
            lane = "BOTTOM";
            role = "DUO_SUPPORT";
            break;
        case "Mid":
            lane = "MIDDLE";
            role = "SOLO";
            break;
        case "Top":
            lane = "TOP";
            role = "SOLO";
            break;
        case "Jungle":
            lane = "JUNGLE";
            role = "NONE";
            break;
        case "Any":
            lane = "ANY";
            role = "ANY";
            break;
    }
    
    var matches = req.body.matches;
    var from_date = new Date(req.body.from_date).getTime();
    var to_date = new Date(req.body.to_date).getTime();

    var options = {
        url: config.URL_SUMMONER_BY_NAME + summoner, 
        headers: {
            "X-Riot-Token": RIOT_KEY
        }
    }

    var data = {};
    data.match_detail = {};

    // Get Summoner Info
    request(options, function(error_summoner, response_summoner, data_summoner) {
        data.summoner = JSON.parse(data_summoner);
        
        options.url = config.URL_100_MATCHES_BY_ID;
        options.url = options.url.replace( "{accountId}", data.summoner.accountId);
        options.url += "&endTime=" + to_date + "&beginTime=" + from_date + "&queue=420";
        console.log(options.url);
        
        // Get latest Ranked matches
        request(options, function(error_matches, response_matches, data_matches) {
            data.matches = JSON.parse(data_matches);
            
            if (data.matches.matches === undefined ) {
                console.log(JSON.stringify(data.matches));
                finish_getting_data();
            } else {
                var match_count = parseInt(matches);
                var count = data.matches.matches.length;
    
                console.log("\n\nMatches: " + data.matches.matches.length);
                console.log("Match Count: " + match_count + "\n\n");
    
    
                // Iterate over each match and look for the match info 
                for (var i = 0; i < data.matches.matches.length; i++) 
                {
                    if (lane == "ANY" || (data.matches.matches[i].lane.localeCompare(lane) == 0 && data.matches.matches[i].role.localeCompare(role) == 0)) 
                    {
                        // Get Match Detail
                        get_match_detail(data.matches.matches[i].gameId, function(err, match) {
                            if (err) {
                                console.log("Error: " + String(err));
                            } else {
                                data.match_detail[match.gameCreation] = match;
    
                                if (--count == 0) {
                                    finish_getting_data(); 
                                } 
                            }
                        });

                    } else if (--count == 0) {
                        finish_getting_data(); 
                    }
                }
            }

            // Return match info after requesting it.
            function get_match_detail(matchId, callback) {

                // TODO > check if match id is on the database, else query for it
                var match_detail_option = 
                {
                    url: config.URL_MATCH_BY_ID, 
                    headers: {
                        "X-Riot-Token": RIOT_KEY
                    }
                }
                match_detail_option.url = match_detail_option.url.replace( "{matchId}", matchId);

                // Request timeline info
                request(match_detail_option, function(error_match, response_match, data_match) {
                    // Parse Timeline
                    var match_obj = JSON.parse(data_match);

                    // If timeline was not returned ok try again 1.5 seconds later
                    if (match_obj.status !== undefined) {
                        setTimeout(function() {
                            get_match_detail(matchId, callback);
                        }, 1500)
                    
                    // If timeline was return and gameCreation date is inside the time frame
                    } else if (match_obj.gameCreation >= from_date || match_obj.gameCreation <= to_date ) {
                        callback(null, match_obj);

                    // If not in the timeframe
                    } else {
                        if (--count == 0) {
                            finish_getting_data(); 
                        }
                    }
                });
            }

            function finish_getting_data() {
                req.app.db.collection('champions').findOne({}, function(err, data_champions) {
                    if (err) { 
                        console.log(String(err));
                    }

                    res.render('matches_data', 
                        {
                            'data': data,
                            'champions' : data_champions,
                            'matches': match_count,
                            'date_in_milliseconds': from_date
                        });
                });
            }

        });
    });
}

exports.summoner_get_name = function(req, res) {
    res.render('index');
}
