var request = require('request');
var fs = require('fs');
const keys = require('../config/keys');

exports.get_static_profile_icons = function(req, res) {
    console.log("Into the function");

    var options = {
        url: 'https://na1.api.riotgames.com/lol/static-data/v3/profile-icons?locale=en_US', 
        headers: {
            "X-Riot-Token": keys.RIOT_KEY
        }
    };

    console.log("after options");

    request(options, function(error, response, body) {
        console.log("Inside request");
        console.log("Body: " + body);
        var profile_icon_data = JSON.parse(body);        
        
        for (var i in profile_icon_data.data) {
            console.log("i: " + i);
            //console.log(i + ": " + profile_icon_data["data"][i]);
            options.url = 'http://ddragon.leagueoflegends.com/cdn/8.3.1/img/profileicon/' + i;
            request(options, function(error, response, body) {
                fs.writeFile("public/images/profileicon/" + i + ".jpg", body, function(err) {
                    if (err) console.log(String(err))
                    console.log("Succesfully writing file " + i + ".jpg");
                });
                
            });
        }
    });
}

exports.get_static_champions = function(req, res) {    
    console.log("Into the function");

    var options = {
        url: 'https://na1.api.riotgames.com/lol/static-data/v3/profile-icons?locale=en_US', 
        headers: {
            "X-Riot-Token": keys.RIOT_KEY
        }
    };

    console.log("after options");

    request(options, function(error, response, body) {
        console.log("Inside request");
        console.log("Body: " + body);
        var profile_icon_data = JSON.parse(body);        
        
        for (var i in profile_icon_data.data) {
            console.log("i: " + i);
            //console.log(i + ": " + profile_icon_data["data"][i]);
            options.url = 'http://ddragon.leagueoflegends.com/cdn/8.3.1/img/profileicon/' + i;
            request(options, function(error, response, body) {
                fs.writeFile("public/images/profileicon/" + i + ".jpg", body, function(err) {
                    if (err) console.log(String(err))
                    console.log("Succesfully writing file " + i + ".jpg");
                });
                
            });
        }
    });
}
