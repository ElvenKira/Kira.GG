const DATABASE_NAME = "KiraApp";
//const DB_USERNAME = "app_user";
const DB_USERNAME = "kira";
//const DB_PASSWORD = "test1234";
const DB_PASSWORD = "saphire6.";
//const DB_URL      = "mongodb://" + DB_USERNAME + ":" + DB_PASSWORD + "@localhost:27017/" + DATABASE_NAME;
const DB_URL      = "mongodb://localhost:27017";
const LOL_VERSION = "8.4.1";
const DRAGONTAIL_URL = "https://ddragon.leagueoflegends.com/cdn/dragontail-" + LOL_VERSION + ".tgz";
const RIOT_KEY = "RGAPI-883ebbe0-bc90-4890-ae37-0f5b04831f35";
const REGION = "la2";
const BASE_URL                = "https://" + REGION + ".api.riotgames.com";
const URL_CHAMPIONS           = BASE_URL + "/lol/static-data/v3/champions?locale=en_US&champListData=all&tags=all&dataById=false";
const URL_ITEMS               = BASE_URL + "/lol/static-data/v3/items?locale=en_US&itemListData=all&tags=all";
const URL_LANGUAGE_STRINGS    = BASE_URL + "/lol/static-data/v3/language-strings?locale=en_US&api_key=RGAPI-bde0d9f2-f3e5-4333-8c3d-4d28d3f3bbd9";
const URL_LANGUAGES           = BASE_URL + "/lol/static-data/v3/languages";
const URL_MAPS                = BASE_URL + "/lol/static-data/v3/maps?locale=en_US";
const URL_MASTERIES           = BASE_URL + "/lol/static-data/v3/masteries?locale=en_US&tags=all&masteryListData=all";
const URL_PROFILE_ICONS       = BASE_URL + "/lol/static-data/v3/profile-icons?locale=en_US";
const URL_REALMS              = BASE_URL + "/lol/static-data/v3/realms";
const URL_REFORGED_RUNE_PATHS = BASE_URL + "/lol/static-data/v3/reforged-rune-paths?locale=en_US";
//const URL_REFORGED_RUNES = "/lol/static-data/v3/reforged-runes?locale=en_US";
const URL_REFORGED_RUNES      = BASE_URL + "/lol/static-data/v3/reforged-runes";
const URL_RUNES               = BASE_URL + "/lol/static-data/v3/runes?locale=en_US&runeListData=all&tags=all";
const URL_SUMMONER_SPELLS     = BASE_URL + "/lol/static-data/v3/summoner-spells?locale=en_US&spellListData=all&dataById=false&tags=all";
const URL_TARBALL_LINKS       = BASE_URL + "/lol/static-data/v3/tarball-links";
const URL_VERSIONS            = BASE_URL + "/lol/static-data/v3/versions";
const URL_SUMMONER_BY_ACCOUNT = BASE_URL + "/lol/summoner/v3/summoners/by-account/";
const URL_SUMMONER_BY_NAME    = BASE_URL + "/lol/summoner/v3/summoners/by-name/";
const URL_SUMMONER_BY_ID      = BASE_URL + "/lol/summoner/v3/summoners/";

const URL_MATCH_BY_ID         = BASE_URL + "/lol/match/v3/matches/{matchId}";
const URL_100_MATCHES_BY_ID   = BASE_URL + "/lol/match/v3/matchlists/by-account/{accountId}?endIndex=100";


//Get all champion mastery entries sorted by number of champion points descending,
const URL_GET_CHAMPION_MASTERY             = BASE_URL + "/lol/champion-mastery/v3/champion-masteries/by-summoner/{summonerId}";

//Get a champion mastery by player ID and champion ID.
const URL_GET_CHAMPION_MASTERY_BY_CHAMP    = BASE_URL + "/lol/champion-mastery/v3/champion-masteries/by-summoner/{summonerId}/by-champion/{championId}";

//Get a player's total champion mastery score, which is the sum of individual champion mastery levels.
const URL_GET_CHAMPION_MASTERY_TOTAL_SCORE = BASE_URL + "/lol/champion-mastery/v3/scores/by-summoner/{summonerId}";

module.exports = {
    DATABASE_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    LOL_VERSION,
    DRAGONTAIL_URL,
    DB_URL,
    RIOT_KEY,
    URL_CHAMPIONS,
    URL_ITEMS,
    URL_LANGUAGE_STRINGS,
    URL_LANGUAGES,
    URL_MAPS,
    URL_MASTERIES,
    URL_PROFILE_ICONS,
    URL_REALMS,
    URL_REFORGED_RUNE_PATHS,
    URL_RUNES,
    URL_SUMMONER_SPELLS,
    URL_TARBALL_LINKS,
    URL_VERSIONS,
    // Champion Mastery 
    URL_GET_CHAMPION_MASTERY,
    URL_GET_CHAMPION_MASTERY_BY_CHAMP,
    URL_GET_CHAMPION_MASTERY_TOTAL_SCORE,
    URL_SUMMONER_BY_ACCOUNT,
    URL_SUMMONER_BY_NAME,
    URL_SUMMONER_BY_ID,
    URL_MATCH_BY_ID,
    URL_100_MATCHES_BY_ID,
}
