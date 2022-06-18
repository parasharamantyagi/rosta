var express = require('express');
var router = express.Router();
const { bodyParser } = require('./../../Model/module');
router.use(bodyParser.json());

// validater = require('./../../validation/adminValidate');
// verifyUser = require('./../../middleware/verifyUser');
adminController = require('./../../controllers/admin/admin.controller');
addManagementSystemController = require('./../../controllers/admin/addManagementSystem.controller');
adminFileController = require('./../../controllers/admin/admin.file.controller');
adminCompetitionController = require('./../../controllers/admin/adminCompetition.controller');

router.get('/', adminController.dashboard); // Get list of user
router.get('/view-party', adminController.viewParty); // Get list of user
router.get('/add-party', adminController.addPartyView); // Get list of user
router.get('/add-user', adminController.addUserView); // Get list of user
router.get('/add-advertiser', adminController.addAdvertiserView); // Get list of user
router.get('/view-user', adminController.viewUser); // Get list of user
router.get('/view-advertiser', adminController.viewAdvertiser); // Get list of user
router.get('/view-history', adminController.viewUser); // Get list of user
router.get('/add-collaboration', adminController.addCollaboration); // Get list of user
router.get('/view-collaboration', adminController.viewCollaboration); // Get list of user
router.get('/system-configuration', adminController.viewSystemConfiguration); // Get list of user
router.get('/social-info', adminController.viewSocialInfo); // Get list of user
router.post('/social-info', adminController.socialInfoPost); // Get list of user
router.get('/add-social-info', adminController.addSocialInfo); // Get list of user
router.post('/add-social-info', adminController.addSocialInfoPost); // Get list of user

router.get('/view-deals', addManagementSystemController.viewDeals); // Get list of user
router.get('/add-deals', addManagementSystemController.addDeals); // Get list of user
router.post('/add-deals', addManagementSystemController.addDealPost); // Get list of user
router.get('/deals/:deal_id', addManagementSystemController.viewDealPage); // Get list of user
router.post('/add-deals/:deal_id', addManagementSystemController.updateDealPost); // Get list of user

router.get('/view-prize', addManagementSystemController.viewPrize); // Get list of user
router.get('/add-prize', addManagementSystemController.addPrize); // Get list of user
router.post('/add-prize', addManagementSystemController.addPrizePost); // Get list of user
router.get('/prize/:prize_id', addManagementSystemController.viewPrizePage); // Get list of user
router.post('/add-prize/:prize_id', addManagementSystemController.updatePrizePost); // Get list of user


router.get('/view-category', addManagementSystemController.viewCategory); // Get list of user
router.get('/add-category', addManagementSystemController.addCategory); // Get list of user
router.post('/add-category', addManagementSystemController.addCategoryPost); // Get list of user



router.get('/view-competition', adminCompetitionController.viewCompetition); // Get list of user
router.get('/add-competition', adminCompetitionController.addCompetition); // Get list of user
router.post('/add-competition', adminCompetitionController.addCompetitionPost); // Get list of user
router.delete('/view-competition/:competition_id', adminCompetitionController.deleteCompetitionId); // Get list of user

router.get('/party/:party_id', adminController.viewPartyPage); // Get list of user

router.post('/question-upload', adminFileController.questionUploadPost); // Get list of user
router.post('/deltaga_image-upload', adminFileController.deltagaImageUploadPost); // Get list of user
router.post('/add-collaboration', adminController.addCollaborationPost); // Get list of user
router.post('/add-party', adminController.addPartyPost); // Get list of user
router.post('/add-party/:party_id', adminController.updatePartyPost); // Get list of user
router.post('/add-user', adminController.addUserPost); // Get list of user
router.post('/add-advertiser', adminController.addAdvertiserPost); // Get list of user
router.post('/delete-data', adminController.deleteData); // Get list of user
router.post('/change-status', adminController.changeStatus); // Get list of user
router.post('/change-configration', adminController.changeConfigration); // Get list of user
// router.put('/update-user/:user_id', verifyUser.isUser, adminController.updateUser); // create varification user

// router.post('/create-user', verifyUser.isUser, adminController.createUser); // create varification user

// router.post('/change-password', verifyUser.isUser, adminController.changePassword); //update list of Unit


module.exports = router;