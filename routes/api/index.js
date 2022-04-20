var express = require('express');
var router = express.Router();
const { bodyParser } = require('./../../Model/module');
router.use(bodyParser.json());

validater = require('../../validation/customValidate');
apiController = require('./../../controllers/api/api.controller');
apiCompetitionController = require('./../../controllers/api/api.competition.controller');

router.get('/', apiController.dashboard); // Get list of user
router.get('/check', apiController.viewCheck); // Get list of user
router.get('/collaboration', apiController.collaboration); // Get list of user
router.get('/party', apiController.getParty); // Get list of user
router.get('/info', apiController.getScreenInfo);
router.post('/question', apiController.getQuestion);
router.get('/user-info/:store_id', apiController.getUserInfo);
router.get('/deals', apiController.getDeals);
router.get('/testing', apiController.getTesting);

router.post('/login', apiController.logIn);
router.post('/sign-up', apiController.signUp);
router.post('/answer', apiController.postAnswer);
router.post('/voting', apiController.voting);
router.post('/check-voting', apiController.checkUserVoting);
router.post('/user', apiController.userList); // Get list of user
router.post('/contact', apiController.contactAdd);
router.post('/feedback', apiController.feedbackAdd);
router.post('/store-uuid', apiController.storeUuid);
router.post('/vote-shedule', apiController.voteShedule);
router.post('/user-info/:store_id', apiController.setUserInfo);
router.post('/add-competition', apiCompetitionController.addCompetition);
// ,validater.validate('addCompetition')

module.exports = router;