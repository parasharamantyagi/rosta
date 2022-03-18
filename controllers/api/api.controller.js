const halper = require('../../halpers/halper');
const Party = require('./../../Model/partyTable');
const Collaboration = require('./../../Model/collaborationTable');
const User = require('./../../Model/userTable');
const Question = require('./../../Model/questionTable');
const Contact = require('./../../Model/contactTable');
const Configration = require('./../../Model/configrationTable');
const multer = require('multer');
const { check_obj, custom_date, change_time_format } = require('../../halpers/halper');
const { jwt, accessTokenSecret } = require('../../Model/module');
const Voting = require('../../Model/votingTable');
const { filterApiQuestion } = require('../../halpers/FilterData');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/party_image/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({ storage: storage }).single('image_link');


class apiController {
  async dashboard(req, res, next) {
    try {
      return res
        .status(200)
        .json(halper.api_response(1, halper.request_message('dashboard'), {}));
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async signUp(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, [
        'email',
        'dob',
        'user_name',
        'password',
        'frequency',
      ]);
      input.password = halper.encrypt(input.password);
      let user_count = await User.getUserByEmail(input.email);
      if (check_obj(user_count)) {
        return res
          .status(206)
          .json(
            halper.api_response(0, halper.request_message('email_exit'), input),
          );
      } else {
        input.role = 'user';
        User.addUser(input, async (err, resdata) => {
          return res
            .status(200)
            .json(
              halper.api_response(
                1,
                halper.request_message('addUser'),
                resdata,
              ),
            );
        });
      }
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(0, halper.request_message('invalid_request'), {}),
        );
    } finally {
    }
  }

  async setUserInfo(req, res, next) {
    try {
      let storeid = req.params.store_id;
      let input = halper.obj_multi_select(req.body, ['email', 'dob']);
      let user_count = await User.getUserByUuid(storeid);
      if (check_obj(user_count)) {
        User.findOneAndUpdate(
          { uuid: storeid },
          {
            $set: input,
          },
          {
            returnNewDocument: true,
          },
          function (err, docs) {},
        );
        return res
          .status(200)
          .json(halper.api_response(1, 'user set successfully', input));
      } else {
        input.uuid = storeid;
        User.addUser(input);
        return res
          .status(200)
          .json(halper.api_response(1, 'user set successfully', input));
      }
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(
            0,
            halper.request_message('invalid_request'),
            err,
          ),
        );
    } finally {
    }
  }

  async getUserInfo(req, res, next) {
    try {
      let storeid = req.params.store_id;
      let user_count = await User.getUserByUuid(storeid);
      if (check_obj(user_count)) {
        return res
          .status(200)
          .json(halper.api_response(1, 'user get successfully', user_count));
      } else {
        return res
          .status(200)
          .json(halper.api_response(1, 'user get successfully', {}));
      }
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(
            0,
            halper.request_message('invalid_request'),
            err,
          ),
        );
    } finally {
    }
  }

  async storeUuid(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['uuid']);
      return res
        .status(200)
        .json(halper.api_response(1, 'uuid store successfully', input));
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(
            0,
            halper.request_message('invalid_request'),
            err,
          ),
        );
    } finally {
    }
  }

  async voting(req, res, next) {
    try {
      let input = halper.obj_multi_select(
        req.body,
        ['party_id', 'device_id'],
        false,
      );
      if (check_obj(req.headers, 'authorization')) {
        const user = await jwt.verify(
          req.headers.authorization,
          accessTokenSecret,
        );
        input.user_id = user.user_id;
      }
      input.voting_date = new Date();
      let voting_data = await Voting.checkVoting(input);
      if (check_obj(voting_data)) {
        input.id = voting_data._id;
        if (
          change_time_format(input.voting_date, 'YYYY-MM-DD') ===
          change_time_format(voting_data.voting_date, 'YYYY-MM-DD')
        ) {
          return res
            .status(206)
            .json(
              halper.api_response(0, 'You have already voted for today', {}),
            );
        } else {
          if (voting_data.party_id !== input.party_id) {
            Party.votersEstimatedMinusInParty(voting_data.party_id);
            Party.votersEstimatedPlusInParty(input.party_id);
          }
          Voting.findOneAndUpdate(
            { _id: input.id },
            {
              $set: {
                party_id: input.party_id,
                voting_date: input.voting_date,
              },
            },
            {
              returnNewDocument: true,
            },
            function (err, docs) {},
          );
          return res
            .status(200)
            .json(
              halper.api_response(1, halper.request_message('vote_add'), input),
            );
        }
      } else {
        Voting.addVoting(input);
        Party.votersEstimatedPlusInParty(input.party_id);
        return res
          .status(200)
          .json(
            halper.api_response(1, halper.request_message('vote_add'), input),
          );
      }
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(
            0,
            halper.request_message('invalid_request'),
            err,
          ),
        );
    } finally {
    }
  }

  async contactAdd(req, res, next) {
    try {
      let input = halper.obj_multi_select(
        req.body,
        ['checkbox1', 'checkbox2', 'notes'],
        false,
      );
      input.createdAt = custom_date();
      Contact.addContact(input);
      return res
        .status(200)
        .json(
          halper.api_response(1, halper.request_message('contactAdd'), input),
        );
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(
            0,
            halper.request_message('invalid_request'),
            err,
          ),
        );
    } finally {
    }
  }

  async collaboration(req, res, next) {
    try {
      Collaboration.getCollaboration(10, (err, resdata) => {
        return res
          .status(200)
          .json(
            halper.api_response(
              1,
              halper.request_message('collaboration'),
              resdata,
            ),
          );
      });
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(0, halper.request_message('invalid_request'), {}),
        );
    } finally {
    }
  }

  async postAnswer(req, res, next) {
    try {
      let submitted_answer = {};
      let input = halper.obj_multi_select(req.body, ['question_id', 'value']);
      submitted_answer.answer_estimated = 1;
      submitted_answer[`select_${input.value}`] = 1;
      Question.questionEstimatedPlus(input.question_id, submitted_answer);
      return res
        .status(200)
        .json(halper.api_response(1, 'Answer submitted successfully', input));
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(0, halper.request_message('invalid_request'), {}),
        );
    } finally {
    }
  }

  async getQuestion(req, res, next) {
    try {
      let response = await Question.getQuestion();
      return res
        .status(200)
        .json(
          halper.api_response(1, 'Question list', filterApiQuestion(response)),
        );
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(0, halper.request_message('invalid_request'), {}),
        );
    } finally {
    }
  }

  async getScreenInfo(req, res, next) {
    try {
      let response = await Configration.getInfoConfigration([
        'Gratis',
        'Integritet',
        'Hej',
        'share',
      ]);
      return res
        .status(200)
        .json(halper.api_response(1, 'info list', response));
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(0, halper.request_message('invalid_request'), {}),
        );
    } finally {
    }
  }

  async getParty(req, res, next) {
    try {
      let response = [];
      let configration = await Configration.getConfigrationByID('party');
      let resdata = await Party.getAllParty(configration.value);
      let userCount = await Voting.getVotingCount();
      for (let resdat of resdata) {
        resdat = resdat.toObject();
        resdat.collaboration = await Collaboration.getCollaborationFromParty(
          resdat._id,
        );
        if (!check_obj(resdat.collaboration)) {
          resdat.collaboration = {};
        }
        response.push(resdat);
      }
      return res.status(200).json(
        halper.api_response(1, halper.request_message('all_party'), {
          total_voters: userCount,
          party_list: response,
        }),
      );
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(0, halper.request_message('invalid_request'), {}),
        );
    } finally {
    }
  }

  async getTesting(req, res, next) {
    try {
      let response = [];
      let checkVal = await Party.removePartyImage("62349988e733f58e8f44217b","party_image/1647614344148amex.jpg");
      console.log(checkVal);
      return res
        .status(200)
        .json(
          halper.api_response(1, halper.request_message('all_party'), response),
        );
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(0, halper.request_message('invalid_request'), {}),
        );
    } finally {
    }
  }

  async logIn(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['email', 'password']);
      let user_count = await User.getUserByEmail(input.email);
      if (check_obj(user_count)) {
        input.password = halper.encrypt(input.password);
        if (user_count.password === input.password) {
          user_count.accessToken = jwt.sign(
            {
              user_id: user_count._id,
              email: user_count.email,
            },
            accessTokenSecret,
          );
          user_count = halper.obj_multi_select(user_count, [
            'accessToken',
            '_id',
            'email',
            'dob',
            'user_name',
            'alias',
            'gdpr',
            'frequency',
            'role',
          ]);

          return res
            .status(200)
            .json(
              halper.api_response(
                1,
                halper.request_message('logIn'),
                user_count,
              ),
            );
        } else {
          return res
            .status(206)
            .json(
              halper.api_response(
                0,
                halper.request_message('email_and_password_match'),
                {},
              ),
            );
        }
      } else {
        return res
          .status(206)
          .json(
            halper.api_response(
              0,
              halper.request_message('email_and_password_match'),
              {},
            ),
          );
      }
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(0, halper.request_message('invalid_request'), {}),
        );
    } finally {
    }
  }

  async viewCheck(req, res, next) {
    try {
      return res
        .status(200)
        .json(halper.api_response(1, halper.request_message('dashboard'), {}));
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async userList(req, res, next) {
    try {
      let data = req.body;
      const pageSize = data.limit || 10;
      const sortByField = data.orderBy || 'createdAt';
      const sortOrder = data.order || -1;
      const paged = data.page || 1;
      let obj = {};
      if (data.fieldName && data.fieldValue)
        obj[data.fieldName] = { $regex: data.fieldValue || '', $options: 'i' };
      if (data.startDate) obj.createdAt = { $gte: new Date(data.startDate) };
      if (data.endDate) obj.createdAt = { $lte: new Date(data.endDate) };
      if (data.filter) {
        obj['$and'] = [];
        obj['$and'].push({
          name: { $regex: data.filter || '', $options: 'i' },
        });
      }
      let count = await User.aggregate([
        { $match: { role: { $ne: 'admin' } } },
        { $match: obj },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]);
      let totalcount = count.length > 0 ? count[0].count : 0;

      User.getUsersWithFilter(
        obj,
        sortByField,
        sortOrder,
        paged,
        pageSize,
        (err, data) => {
          if (err) {
            return res
              .status(200)
              .json({ message: 'Error in user query', data: {}, error: err });
          } else {
            return res.status(200).json({
              message: 'All User',
              totalcount: totalcount,
              data: data,
              error: {},
            });
          }
        },
      );
    } catch (err) {
      return res
        .status(401)
        .json(
          halper.api_response(0, halper.request_message('invalid_request'), {}),
        );
    } finally {
    }
  }
}

module.exports = new apiController();

