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
    
    var matches = 10;
    if (!isNaN(req.body.matches)) {
        matches  = req.body.matches;
    }

    var from_date = new Date(req.body.from_date).getTime();
    var to_date =   new Date(req.body.to_date).getTime();

    var options = {
        url: config.URL_SUMMONER_BY_NAME + summoner, 
        headers: {
            "X-Riot-Token": RIOT_KEY
        }
    }

    var data = {};
    data.match_detail = {};
    var output_records = 0;

    // Get Summoner Info
    request(options, function(error_summoner, response_summoner, data_summoner) {        
        data.summoner = JSON.parse(data_summoner);

        if (data.summoner.status !== undefined) {
            console.log(JSON.stringify(data.summoner.status));
            res.redirect("/");
        }
        
        options.url = config.URL_100_MATCHES_BY_ID;
        options.url = options.url.replace( "{accountId}", data.summoner.accountId);
        if (!isNaN(to_date)) {
            options.url += "&endTime=" + to_date;
        }
        if (!isNaN(from_date)) {
            options.url += "&beginTime=" + from_date;
        }
        options.url += "&queue=420";

        console.log(options.url);
        
        // Get latest Ranked matches
        request(options, function(error_matches, response_matches, data_matches) {
            data.matches = JSON.parse(data_matches);
            if (data.matches.status !== undefined) {
                console.log(JSON.stringify(data.matches.status));
                res.redirect("/");
            }

            var match_count = parseInt(matches);
            var count = data.matches.matches.length;

            console.log("\n\nMatches: " + data.matches.matches.length);
            console.log("Match Count: " + match_count + "\n\n");

            process_data(data.matches.matches, 1);

            
            function process_data(match_data, count) {
                if (output_records >= match_count || count >= match_data.length) {
                    req.app.db.collection('champions').findOne({}, function(err, data_champions) {
                        res.render('matches_data', 
                        {
                            'data': data,
                            'champions' : data_champions,
                            'matches': match_count
                        });
                    });
                } else {
                    if (lane == "ANY" || (data.matches.matches[count - 1].lane.localeCompare(lane) == 0 && data.matches.matches[count - 1].role.localeCompare(role) == 0)) 
                    {
                        // TODO > check if match id is on the database, else query for it
                        var match_detail_option = { url: config.URL_MATCH_BY_ID, headers: {"X-Riot-Token": RIOT_KEY}};
                        match_detail_option.url = match_detail_option.url.replace( "{matchId}", data.matches.matches[count - 1].gameId);

                        // Request timeline info
                        request(match_detail_option, function(error_match, response_match, data_match) {
                            // Parse Timeline
                            var match_obj = JSON.parse(data_match);
                            if (match_obj.status !== undefined && match_obj.status.message == "Forbidden") {
                                data.match_detail[match_obj.gameCreation] = match_obj;
                                console.log("Retrying for " + data.matches.matches[count - 1].gameId + "!");
                                setTimeout(function() {
                                    process_data(match_data, count);
                                }, 1200);
                            } else {
                                // Add to data output
                                data.match_detail[match_obj.gameCreation] = match_obj;
                                output_records++;

                                var limitCount = response_match["headers"]["x-app-rate-limit-count"].split(",");
                                if (output_records < match_count && match_data.length > count) {
                                    if (limitCount[0] == "20:1") {
                                        setTimeout(function() {
                                            process_data(match_data, ++count);
                                        }, 1200);
                                    } else {
                                        process_data(match_data, ++count);
                                    }
                                } else {
                                    req.app.db.collection('champions').findOne({}, function(err, data_champions) {
                                        res.render('matches_data', 
                                        {
                                            'data': data,
                                            'champions' : data_champions,
                                            'matches': match_count
                                        });
                                    });
                                }
                            }
                        });
                    } else {
                        process_data(match_data, ++count);
                    }
                }
            }
        });
    });
}

exports.summoner_get_name = function(req, res) {
    res.render('index');
}
