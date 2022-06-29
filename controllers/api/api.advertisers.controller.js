const halper = require('../../halpers/halper');
const Competition = require('./../../Model/competitionTable');
const Advertiser = require('./../../Model/advertiserTable');
const MyFavouriteAdvertiser = require('./../../Model/myFavouriteAdvertiserTable');
const SocialInfo = require('./../../Model/socialInfoTable');
const { filterApiQuestion } = require('../../halpers/FilterData');
const { body, validationResult } = require('express-validator');
const { jwt, accessTokenSecret } = require('../../Model/module');

const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/target_url/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage }).single('target_url');

class apiAdvertisersController {
  async advertisersGet(req, res, next) {
    try {
      let user_id = '';
      if (halper.check_obj(req.headers, 'authorization')) {
        const user = await jwt.verify(
          req.headers.authorization,
          accessTokenSecret,
        );
        user_id = user.user_id;
      }
      let resdata = await Advertiser.getSelectedAdvertiser(user_id);
      return res
        .status(200)
        .json(
          halper.api_response(
            1,
            halper.request_message('advertisersGet'),
            resdata,
          ),
        );
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async advertisersGetInPost(req, res, next) {
    try {
      let response = [];
      let inputData = halper.obj_multi_select(req.body, ['device_id']);
      let all_advertisers = await Advertiser.getAdvertiser(100);
      for (let all_advertiser of all_advertisers) {
        all_advertiser = all_advertiser.toObject();
        all_advertiser.my_favourite = 0;
        all_advertiser.view_advertiser = [];
        if (halper.check_obj(inputData, 'device_id')) {
          all_advertiser.my_favourite = await MyFavouriteAdvertiser.getMyFavouriteAdvertiser(
              inputData.device_id,
              all_advertiser._id,
            );
          all_advertiser.view_advertiser = await MyFavouriteAdvertiser.getViewAdvertiser(all_advertiser._id);
          all_advertiser.my_favourite = halper.check_obj(all_advertiser.my_favourite) && all_advertiser.my_favourite.my_favourite ? 1 : 0;
        }
        response.push(all_advertiser);
      }
      return res
        .status(200)
        .json(
          halper.api_response(
            1,
            halper.request_message('advertisersGet'),
            response,
          ),
        );
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async advertisersPost(req, res, next) {
    try {
      const user = await jwt.verify(
        req.headers.authorization,
        accessTokenSecret,
      );
      upload(req, res, async function (err) {
        let inputData = halper.obj_multi_select(req.body);
        if (req.file) {
          inputData.target_url = 'target_url/' + req.file.filename;
        }
        inputData.user_id = user.user_id;
        inputData.createdAt = new Date();
        inputData.updatedAt = new Date();
        Advertiser.addAdvertiser(inputData);
        return res
          .status(200)
          .json(
            halper.api_response(
              1,
              halper.request_message('advertisersPost'),
              inputData,
            ),
          );
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async viewCountSocial(req, res, next) {
    try {
        let inputData = halper.obj_multi_select(req.body, ['social_id']);
        SocialInfo.clickCountPlus(inputData.social_id);
        return res
          .status(200)
          .json(halper.api_response(1, 'Count increase successfully', {}));
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async socialInfoGet(req, res, next) {
    try {
      SocialInfo.getSocialInfo(100, (err, resdata) => {
        return res
          .status(200)
          .json(
            halper.api_response(
              1,
              halper.request_message('advertisersGet'),
              resdata,
            ),
          );
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async socialInfoPost(req, res, next) {
    try {
      let inputData = halper.obj_multi_select(req.body);
      SocialInfo.saveSocialInfo(inputData);
      return res
        .status(200)
        .json(
          halper.api_response(
            1,
            halper.request_message('advertisersPost'),
            inputData,
          ),
        );
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new apiAdvertisersController();

