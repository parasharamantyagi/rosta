var express = require('express');
var router = express.Router();
const { bodyParser } = require('./../../Model/module');
router.use(bodyParser.json());

apiController = require('./../../controllers/api/api.controller');

router.get('/', apiController.dashboard); // Get list of user
router.get('/check', apiController.viewCheck); // Get list of user
router.get('/collaboration', apiController.collaboration); // Get list of user
router.get('/party', apiController.getParty); // Get list of user
router.get('/user-info/:store_id', apiController.getUserInfo);
router.post('/user-info/:store_id', apiController.setUserInfo);

router.post('/login', apiController.logIn);
router.post('/sign-up', apiController.signUp);
router.post('/voting', apiController.voting);
router.post('/user', apiController.userList); // Get list of user
router.post('/contact', apiController.contactAdd);
router.post('/store-uuid', apiController.storeUuid);


module.exports = router;