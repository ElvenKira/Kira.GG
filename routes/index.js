const express = require('express');
const router = express.Router();

// Require controller modules.
var summoner_controller = require('../controllers/summonerController');
var matches_controller = require('../controllers/matchesController');
var static_controller = require('../controllers/staticController');

router.get('/', summoner_controller.summoner_get_name);

// GET player
router.get('/summoner/', summoner_controller.summoner_get_name);
router.post('/summoner/data/', summoner_controller.summoner_get_data_by_name);

router.get('/data/get_static_champions', static_controller.get_static_champions);
router.get('/data/get_static_profile_icons', static_controller.get_static_profile_icons);

router.post('/matches/', matches_controller.matches_get_data_by_name);

module.exports = router;