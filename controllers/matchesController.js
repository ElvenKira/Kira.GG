var request = require('request');
var config = require('../config');

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
    var date = new Date(req.body.date).getTime();
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
            
            if (data.matches.matches === undefined ) {
                console.log(JSON.stringify(data.matches));
                finish_getting_data();
            } else {
                var match_count = parseInt(matches);
                var count = data.matches.matches.length;
    
                console.log("\n\nMatches: " + data.matches.matches.length);
                console.log("Match Count: " + match_count + "\n\n");
    
    
                // Iterate over each match and look for the match info 
                for (var i = 0; i < data.matches.matches.length; i++) {
                    console.log("lane: " + data.matches.matches[i].lane + " - role: " + data.matches.matches[i].role);
                    // Check that Role matches
                    if ( 
                        (lane == "ANY" || 
                        (
                            data.matches.matches[i].lane.localeCompare(lane) == 0 &&
                            data.matches.matches[i].role.localeCompare(role) == 0
                        )
                        ) && data.matches.matches[i].queue == 420
                    ) {
                        var match_detail_option = {
                            url: config.URL_MATCH_BY_ID, 
                            headers: {
                                "X-Riot-Token": config.RIOT_KEY
                            }
                        }
    
                        match_detail_option.url = match_detail_option.url.replace( "{matchId}", data.matches.matches[i].gameId);
    
                        get_match_detail(match_detail_option, function(err, match) {
                            
                            if (err) {
                                console.log("Error: " + String(err));
                            } else {
                                data.match_detail[match.gameCreation] = match;
    
                                if (Object.keys(data.match_detail).length == match_count || --count == 0) {
                                    finish_getting_data(); 
                                }
                            }
                        })
                    } else {
                        if (Object.keys(data.match_detail).length == match_count || --count == 0) {
                            finish_getting_data(); 
                        } else {
                            console.log(count);
                        }
                    }
                }
            }

            function get_match_detail(match_detail_option, callback) {
                request(match_detail_option, function(error_match, response_match, data_match) {
                    var match_obj = JSON.parse(data_match);
                    
                    if (match_obj.status !== undefined) {
                        setTimeout(function() {
                            get_match_detail(match_detail_option, callback);
                        }, 1500)
                    } else if (match_obj.gameCreation >= date) {
                        callback(null, match_obj);
                    } else {
                        if (Object.keys(data.match_detail).length == match_count || --count == 0) {
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
                            'date_in_milliseconds': date
                        });
                });
            }

        });
    });
}

exports.summoner_get_name = function(req, res) {
    res.render('index');
}
