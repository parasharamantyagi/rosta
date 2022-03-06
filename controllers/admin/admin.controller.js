const halper = require('../../halpers/halper');
const Party = require('./../../Model/partyTable');
const Collaboration = require('./../../Model/collaborationTable');
const User = require('./../../Model/userTable');
const Configration = require('./../../Model/configrationTable');
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

var upload = multer({ storage: storage }).single('image_link');

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
      Party.getParty(10, (err, resdata) => {
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

  async changeConfigration(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, [
        'id',
        'type',
        'value'
      ]);
      if (input.type === 'configuration') {
        Configration.updateConfigrationByID({
          id: input.id,
          value: input.value,
        },function(err, resData){
          return res.status(200).json(resData);
        });
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
      upload(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
          inputData.image_link = 'party_image/' + req.file.filename;
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
      upload(req, res, async function (err) {
        let inputData = req.body;
        if (req.file) {
          inputData.image_link = 'party_image/' + req.file.filename;
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

  async addUserPost(req, res, next) {
    try {
      upload(req, res, async function (err) {
        let inputData = req.body;
        User.addUser(inputData, async (err, resdata) => {
          // console.log(err);
          // console.log(addUser);
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
        // return res.json(resdata);
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
}

module.exports = new adminController();

