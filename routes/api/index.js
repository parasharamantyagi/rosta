var express = require('express');
var router = express.Router();
const { bodyParser } = require('./../../Model/module');
router.use(bodyParser.json());

validater = require('../../validation/customValidate');
apiController = require('./../../controllers/api/api.controller');
apiCompetitionController = require('./../../controllers/api/api.competition.controller');
apiAdvertisersController = require('./../../controllers/api/api.advertisers.controller');
apiConfigrationController = require('./../../controllers/api/api.configration.controller');
apiForgotPasswordController = require('./../../controllers/api/api.forgotPassword.controller');

router.get('/', apiController.dashboard); // Get list of user
router.get('/check', apiController.viewCheck); // Get list of user
router.get('/collaboration', apiController.collaboration); // Get list of user
router.get('/party', apiController.getParty); // Get list of user
router.get('/graph-party', apiController.getGraphParty); // Get list of user
router.get('/info', apiController.getScreenInfo);
router.get('/get_server_data', apiController.getServerData);
router.post('/question', apiController.getQuestion);
router.get('/user-info/:store_id', apiController.getUserInfo);
router.get('/deals', apiController.getDeals);
router.get('/prize', apiController.getPrize);
router.get('/testing', apiController.getTesting);
router.get('/all-competition', apiCompetitionController.getAllUpcomingCompetition);
router.get('/get-competition', apiCompetitionController.getCompetition);


router.post('/get-generate-token', apiCompetitionController.getGenerateTokens);
router.post('/generate-token', apiCompetitionController.addGenerateTokens);


router.post('/login', apiController.logIn);
router.post('/sign-up', apiController.signUp);
router.post('/store-version', apiController.storeVersion);
router.post('/verify-version', apiController.verifyVersion);
router.post('/answer', apiController.postAnswer);
router.post('/voting', apiController.voting);
router.post('/check-voting', apiController.checkUserVoting);
router.post('/user', apiController.userList); // Get list of user
router.post('/contact', apiController.contactAdd);
router.post('/feedback', apiController.feedbackAdd);
router.post('/store-uuid', apiController.storeUuid);
router.post('/vote-shedule', apiController.voteShedule);
router.post('/my-vote', apiController.myVote);
router.post('/favourite-advertiser', apiController.favouriteAdvertiser);
router.post('/view-advertiser', apiController.viewAdvertiser);
router.post('/user-info/:store_id', apiController.setUserInfo);
router.post('/add-competition', apiCompetitionController.addCompetition);
router.post('/my-competition', apiCompetitionController.myCompetition);

router.get('/advertisers', apiAdvertisersController.advertisersGet);
router.post('/advertisers-get', apiAdvertisersController.advertisersGetInPost);
router.post('/advertisers', apiAdvertisersController.advertisersPost);

router.get('/social-info', apiAdvertisersController.socialInfoGet);
router.post('/view-count-social', apiAdvertisersController.viewCountSocial);
router.post('/social-info', apiAdvertisersController.socialInfoPost);

router.get('/all-configration', apiConfigrationController.configrationInfo);
router.post('/add-configration', apiConfigrationController.configrationInfoAdd);
router.post('/remove-configration', apiConfigrationController.configrationInfoRemove);


router.post('/forgot-password', apiForgotPasswordController.forgotPassword);
router.post('/verify-otp', apiForgotPasswordController.verifyOtp);
router.post('/change-password', apiForgotPasswordController.changePassword);
router.post('/update-password', apiForgotPasswordController.updatePassword);

module.exports = router;