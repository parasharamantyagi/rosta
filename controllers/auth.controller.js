// const dateFormat = require("dateformat");
var User = require('./../Model/userTable');
const halper = require('../halpers/halper');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/profile_image/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({ storage: storage }).single('profile_image');

class authController {
  indexRoute(req, res, next) {
    let my_link = 'http://52.21.91.157/ctrl-icon/ctrl_title3x.png';
    res.render('login', { rosta: halper, my_link: my_link });
  }

  async logIn(req, res, next) {
    try {
      upload(req, res, async function (err) {
        let inputData = halper.obj_multi_select(req.body, ['email', 'password']);
        inputData.password = halper.encrypt(inputData.password);
        User.adminLogin(inputData,async (err,resdata)=>{
          if(halper.check_obj(resdata)){
            // let session = req.session;
            // session.email = inputData.email;
            return res
              .status(200)
              .json(halper.web_response(true, false, halper.request_message('logIn'),'admin'));
          }else{
            return res.status(200).json(halper.web_response(false, true, halper.request_message('email_and_password_match')));
          }
      });
      });
      
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async userSeeds(req, res, next) {
    try {
      let inputData = halper.obj_multi_select(req.body, ['email', 'password']);
      inputData.password = halper.encrypt(inputData.password);
      User.addUser(inputData);
      // User.addAdmin(inputData, (err, user) => {
        // if (err) {
          // return res.status(200).json(
            // halper.api_response(0, halper.request_message('invalid_request'), err)
          // );
        // } else {
          return res.status(200).json(
            halper.api_response(1, halper.request_message('getUser'), inputData),
          );
        // }
      // });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
  
  async userAdd(req, res, next) {
	  
  }
}

module.exports = new authController();

