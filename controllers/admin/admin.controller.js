const halper = require('../../halpers/halper');
const Party = require('./../../Model/partyTable');
const Collaboration = require('./../../Model/collaborationTable');
const SocialInfo = require('./../../Model/socialInfoTable');
const User = require('./../../Model/userTable');
const Configration = require('./../../Model/configrationTable');
const Voting = require('./../../Model/votingTable');
const multer = require('multer');
const { check_obj } = require('../../halpers/halper');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/party_image/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var storageicon = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/icon/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage }).single('image_link');
const multiUpload = multer({ storage: storage }).any('image_link');
const uploadIcon = multer({ storage: storageicon }).single('icon');

// const findUser = async function () { 
//         try {  return await User.getUsersCount();
//         } catch(err) { console.log(err) }
//     }

class adminController {
  async dashboard(req, res, next) {
    let user_count = await User.getUsersCount();
    let party_count = await Party.getPartyCount();
    return res.render('admin/dashboard', {
      rosta: halper,
      page_url: req.url,
      user_count: user_count,
      party_count: party_count,
    });
  }

  async viewParty(req, res, next) {
    try {
      Party.getParty(100, (err, resdata) => {
        return res.render('admin/viewparty', {
          rosta: halper,
          page_url: req.url,
          parties: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  viewPartyPage(req, res, next) {
    try {
      Party.getPartyById(req.params.party_id, (err, resdata) => {
        return res.render('admin/addparty', {
          formAction: `./../add-party/${req.params.party_id}`,
          partyData: resdata,
          rosta: halper,
          page_url: req.url,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addPartyView(req, res, next) {
    try {
      return res.render('admin/addparty', {
        formAction: 'add-party',
        partyData: {},
        rosta: halper,
        page_url: req.url,
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async viewSystemConfiguration(req, res, next) {
    try {
      // Configration.saveConfigration({ name: 'factor_value', value: '0.1' });
      Configration.getConfigration(100, async (err, resdata) => {
        return res.render('admin/viewConfigration', {
          rosta: halper,
          page_url: req.url,
          configrations: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addSocialInfo(req, res, next) {
    try {
      return res.render('admin/socialInfo/addSocialInfo', {
        rosta: halper,
        page_url: req.url,
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addSocialInfoPost(req, res, next) {
    try {
      uploadIcon(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
          inputData.icon = 'icon/' + req.file.filename;
        }
        SocialInfo.saveSocialInfo(inputData);
        return res
          .status(200)
          .json(
            halper.web_response(
              true,
              false,
              'Link add successfully',
              halper.web_link('admin/social-info'),
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

  async viewSocialInfo(req, res, next) {
    try {
      SocialInfo.getSocialInfo(100, async (err, resdata) => {
        return res.render('admin/socialInfo/viewSocialInfo', {
          rosta: halper,
          page_url: req.url,
          socialInfos: resdata,
        });
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
      upload(req, res, async function (err) {
        let inputData = req.body;
        SocialInfo.updateSocialInfoByID(
          inputData.id,
          { value: inputData.value },
          function (err, resData) {
            return resData;
          },
        );
        return res
          .status(200)
          .json(
            halper.web_response(
              true,
              false,
              'Link updated successfully',
              halper.web_link('admin/social-info'),
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

  async changeConfigration(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['id', 'type', 'value']);
      console.log(input);
      // getConfigrationByID;
      if (input.type === 'configuration') {
        Configration.updateConfigrationByID(
          {
            id: input.id,
            value: input.value,
          },
          function (err, resData) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  'Configuration update successfully',
                  halper.web_link('admin/system-configuration'),
                ),
              );
          },
        );
      }
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async updatePartyPost(req, res, next) {
    try {
      let party_id = req.params.party_id;
      multiUpload(req, res, async function (err) {
        let inputData = req.body;
        console.log(inputData);
        if (halper.check_array_length(req.files)) {
          inputData.image_link = halper.filter_by_id_party_image(
            req.files,
            'filename',
          );
        }
        inputData.id = party_id;
        Party.updateParty(inputData, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('updatePartyPost'),
                  halper.web_link('admin/view-party'),
                ),
              );
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
  async addPartyPost(req, res, next) {
    try {
      multiUpload(req, res, async function (err) {
        let inputData = req.body;
        if (halper.check_array_length(req.files)) {
          inputData.image_link = halper.filter_by_id_party_image(
            req.files,
            'filename',
          );
        }
        Party.addParty(inputData, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('addParty'),
                  'view-party',
                ),
              );
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

  async changeStatus(req, res, next) {
    try {
      let inputData = req.body;
      if (inputData.type === 'users') {
        User.updateStatus(
          { id: inputData.id, is_verified: inputData.is_check },
          async (err, resdata) => {
            return res.status(200).json(resdata);
          },
        );
      }
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async deleteData(req, res, next) {
    try {
      let inputData = req.body;
      if (inputData.action === 'party') {
        Party.removeParty(inputData.id, async (err, resdata) => {
          if (check_obj(resdata)) {
            Voting.removeVoting(inputData.id);
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('deleteParty'),
                  'view-party',
                ),
              );
          }
        });
      } else if (inputData.action === 'user') {
        User.removeUser(inputData.id, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('deleteUser'),
                  'view-user',
                ),
              );
          }
        });
      } else if (inputData.action === 'party_image') {
        Party.removePartyImage(
          inputData['id[image_id]'],
          inputData['id[image_link]'],
        );
        return true;
        // if (check_obj(get_Perty)) {
        //   return res
        //     .status(200)
        //     .json(
        //       halper.web_response(
        //         true,
        //         false,
        //         'Image delete succfully',
        //         'view-party',
        //       ),
        //     );
        // }
      } else if (inputData.action === 'socialInfo') {
        SocialInfo.removeSocialInfo(inputData.id, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('deleteSocialInfo'),
                  'social-info',
                ),
              );
          }
        });
      } else if (inputData.action === 'prize') {
        const Prize = require('./../../Model/prizesTable');
        Prize.removePrize(inputData.id, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('deletePrize'),
                  'view-prize',
                ),
              );
          }
        });
      } else if (inputData.action === 'category') {
        const Category = require('./../../Model/categoryTable');
        Category.removCategory(inputData.id, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('deleteCategory'),
                  'view-category',
                ),
              );
          }
        });
      } else if (inputData.action === 'deals') {
        const Deals = require('./../../Model/dealsTable');
        Deals.removeDeals(inputData.id, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('deleteDeals'),
                  'view-deals',
                ),
              );
          }
        });
      } else if (inputData.action === 'collaboration') {
        Collaboration.removeCollaboration(
          inputData.id,
          async (err, resdata) => {
            if (check_obj(resdata)) {
              return res
                .status(200)
                .json(
                  halper.web_response(
                    true,
                    false,
                    halper.request_message('deleteCollaboration'),
                    'view-collaboration',
                  ),
                );
            }
          },
        );
      }
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addCollaboration(req, res, next) {
    try {
      Party.getParty(10, (err, resdata) => {
        return res.render('admin/addCollaboration', {
          rosta: halper,
          page_url: req.url,
          parties: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addCollaborationPost(req, res, next) {
    try {
      upload(req, res, async function (err) {
        let inputData = req.body;
        Collaboration.addCollaboration(inputData, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('addCollaboration'),
                  'view-collaboration',
                ),
              );
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

  async viewCollaboration(req, res, next) {
    try {
      Collaboration.getCollaboration(10, (err, resdata) => {
        return res.render('admin/viewCollaboration', {
          rosta: halper,
          page_url: req.url,
          collaborations: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), err),
      );
    } finally {
    }
  }

  async addAdvertiserView(req, res, next) {
    try {
      return res.render('admin/addAdvertiser', {
        rosta: halper,
        page_url: req.url,
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addUserView(req, res, next) {
    try {
      return res.render('admin/addUser', {
        rosta: halper,
        page_url: req.url,
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addAdvertiserPost(req, res, next) {
    try {
      upload(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
          inputData.add_logo = 'party_image/' + req.file.filename;
        }
        if (check_obj(inputData, 'password')) {
          inputData.password = halper.encrypt(inputData.password);
        }
        inputData.role = 'advertiser';
        inputData.is_verified = 1;
        User.addUser(inputData, async (err, resdata) => {
          // console.log(err);
          // console.log(resdata);
        });
        return res
          .status(200)
          .json(
            halper.web_response(
              true,
              false,
              'Advertiser add successfully',
              halper.web_link('admin/view-advertiser'),
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

  async addUserPost(req, res, next) {
    try {
      upload(req, res, async function (err) {
        let inputData = req.body;
        if (check_obj(inputData, 'password')) {
          inputData.password = halper.encrypt(inputData.password);
        }
        inputData.is_verified = 1;
        if (check_obj(inputData, 'email')) {
          let check_email = await User.getUserByEmail(inputData.email);
          if (check_obj(check_email)) {
            return res.json(
              halper.web_error_response(
                false,
                true,
                halper.request_message('email_exit'),
                4000,
              ),
            );
          }
        }
        User.addUser(inputData, async (err, resdata) => {
          if (check_obj(resdata)) {
            return res
              .status(200)
              .json(
                halper.web_response(
                  true,
                  false,
                  halper.request_message('addUser'),
                  'view-user',
                ),
              );
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

  async viewUser(req, res, next) {
    try {
      User.getUsers(10, (err, resdata) => {
        return res.render('admin/viewUser', {
          rosta: halper,
          page_url: req.url,
          users: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), err),
      );
    } finally {
    }
  }

  async viewAdvertiser(req, res, next) {
    try {
      User.getUsersAdvertiser(10, (err, resdata) => {
        return res.render('admin/viewAdvertiser', {
          rosta: halper,
          page_url: req.url,
          users: resdata,
        });
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), err),
      );
    } finally {
    }
  }
}

module.exports = new adminController();

