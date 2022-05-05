var express = require('express');
var router = express.Router();
const { bodyParser } = require('./../../Model/module');
router.use(bodyParser.json());

// validater = require('./../../validation/userValidate');
// verifyUser = require('./../../middleware/verifyUser');
authController = require('./../../controllers/auth.controller');
cronJobController = require('./../../controllers/cronJob.controller');

router.get('/cron-job', cronJobController.myCronJob);
router.get('/', authController.indexRoute);
router.post('/login', authController.logIn);

router.post('/user-add', authController.userAdd);


// router.get('/check-token', verifyUser.isUser, authController.checkToken);
// router.get('/logout', verifyUser.isUser, authController.logOut);
// router.get('/profile', verifyUser.isUser, authController.profile);
// router.get('/roles', authController.baseRole);
router.post('/login', authController.logIn);

module.exports = router;