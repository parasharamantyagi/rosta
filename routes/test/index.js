var express = require('express');
var router = express.Router();
const { bodyParser } = require('./../../Model/module');
router.use(bodyParser.json());

testController = require('./../../controllers/test/test.controller');

router.get('/', testController.getUser); // Get list of user


router.post('/add-user', testController.addUser); // Get list of user

module.exports = router;