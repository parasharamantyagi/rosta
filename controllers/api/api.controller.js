const halper = require('../../halpers/halper');
const Party = require('./../../Model/partyTable');
const Collaboration = require('./../../Model/collaborationTable');
const User = require('./../../Model/userTable');
const Question = require('./../../Model/questionTable');
const Deals = require('./../../Model/dealsTable');
const Prize = require('./../../Model/prizesTable');
const Category = require('./../../Model/categoryTable');
const Contact = require('./../../Model/contactTable');
const Feedback = require('./../../Model/feedbackTable');
const Configration = require('./../../Model/configrationTable');
const QuestionAnswer = require('./../../Model/questionAnswerTable');
const VoteSchedule = require('./../../Model/voteSchedule');
const mail = require('./../../halpers/mail');
const MailTemplate = require('./../../halpers/mail_template');
const multer = require('multer');
const { check_obj, custom_date, change_time_format, current_date, randomValueHex } = require('../../halpers/halper');
const { push_notification_single } = require('../../trait/notification');
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
      let input = halper.obj_multi_select(req.body, [
        'nick_name',
        'email',
        'dob'
      ]);
      let user_count = await User.getUserByUuid(storeid);
      if (check_obj(user_count)) {
        let checkUserReferralCode = await User.getUserByReferralCode(storeid);
        let input_referral_code = halper.obj_multi_select(req.body, [
            'referral_code',
          ]);
        if (!check_obj(checkUserReferralCode)) {
          if (check_obj(input_referral_code)) {
            input_referral_code.referral_code =
              input_referral_code.referral_code.replace(
                'https://rostaratt.com?',
                '',
              );
            let user_my_id = await User.findUserByMyId(
              input_referral_code.referral_code,
            );
            if (!check_obj(user_my_id)) {
              return res
                .status(200)
                .json(
                  halper.api_response(
                    0,
                    halper.request_message('invalid_referral_code'),
                    input,
                  ),
                );
            }
            User.addReferralCode({
              id: user_my_id.uuid,
              referral_code: storeid,
            });
          }
        }else{
          if (check_obj(input_referral_code)) {
            return res
              .status(200)
              .json(
                halper.api_response(
                  0,
                  halper.request_message('use_referral_code'),
                  input,
                ),
              );
          }
        }
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
          .json(
            halper.api_response(1, halper.request_message('user_set'), input),
          );
      } else {
        let input_referral_code = halper.obj_multi_select(req.body, [
          'referral_code',
        ]);
        input.uuid = storeid;
        if (check_obj(input_referral_code)) {
          input_referral_code.referral_code =
            input_referral_code.referral_code.replace(
              'https://rostaratt.com?',
              '',
            );
          let user_my_id = await User.findUserByMyId(
            input_referral_code.referral_code,
          );
          if (!check_obj(user_my_id)) {
            return res
              .status(200)
              .json(
                halper.api_response(
                  0,
                  halper.request_message('invalid_referral_code'),
                  input,
                ),
              );
          }
          input_referral_code.referral_code = user_my_id.uuid;
          User.addUser(input, async (err, resdata) => {
            User.addReferralCode({
              id: input_referral_code.referral_code,
              referral_code: input.uuid,
            });
          });
        }else{
          User.addUser(input, async (err, resdata) => {
          });
        }
        return res
          .status(200)
          .json(
            halper.api_response(1, halper.request_message('user_set'), input),
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

  async getUserInfo(req, res, next) {
    try {
      let storeid = req.params.store_id;
      let user_count = await User.getUserByUuid(storeid);
      if (check_obj(user_count)) {
        if (!check_obj(user_count, 'dob')) {
          user_count.dob = '';
        }
        return res
          .status(200)
          .json(
            halper.api_response(
              1,
              halper.request_message('user_get'),
              user_count,
            ),
          );
      } else {
        return res
          .status(200)
          .json(halper.api_response(0, halper.request_message('user_get'), {}));
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
      let input = halper.obj_multi_select(req.body, ['uuid', 'device_token']);
      let checkUser = await User.getUserByOnlyUuid(input.uuid);
      if (check_obj(checkUser)) {
        User.updateUserData(checkUser._id, input);
        return res
          .status(200)
          .json(
            halper.api_response(1, halper.request_message('uuid_store'), input),
          );
      } else {
        User.addUser(input, async (err, resdata) => {
          return res
            .status(200)
            .json(
              halper.api_response(
                1,
                halper.request_message('uuid_store'),
                input,
              ),
            );
        });
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

  async checkUserVoting(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['device_id'], false);
      let voting_data = await Voting.checkVoting(input);
      if (check_obj(voting_data)) {
        return res
          .status(200)
          .json(halper.api_response(1, 'You have been voted', voting_data));
      } else {
        return res
          .status(200)
          .json(halper.api_response(0, 'You have no vote', voting_data));
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

  async getPrize(req, res, next) {
    try {
      let deltaga_data = await Configration.getInfoSelectConfigration(
        ['deltaga_text', 'deltaga_image'],
        ['name', 'value'],
      );

      Prize.getPrize(100, (err, resdata) => {
        return res.status(200).json(
          halper.api_response(1, halper.request_message('getPrize'), {
            deltaga: deltaga_data,
            prize_data: resdata,
          }),
        );
      });
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

  async getDeals(req, res, next) {
    try {
      Category.getCategoryWithDeals(100, (err, resdata) => {
        return res
          .status(200)
          .json(
            halper.api_response(1, halper.request_message('getDeals'), resdata),
          );
      });
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
        ['party_id', 'device_id', 'eighteen_above'],
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
              halper.api_response(
                0,
                halper.request_message('have_already_voted'),
                {},
              ),
            );
        } else {
          if (voting_data.party_id !== input.party_id) {
            Party.votersEstimatedMinusInParty(voting_data.party_id);
            if (voting_data.eighteen_above) {
              Party.votersAgeEstimatedPlusInParty(voting_data.party_id, {
                eighteen_above: -1,
              });
            } else {
              Party.votersAgeEstimatedPlusInParty(voting_data.party_id, {
                eighteen_bellow: -1,
              });
            }
            Party.votersEstimatedPlusInParty(input.party_id);
            if (input.eighteen_above) {
              Party.votersAgeEstimatedPlusInParty(input.party_id, {
                eighteen_above: 1,
              });
            } else {
              Party.votersAgeEstimatedPlusInParty(input.party_id, {
                eighteen_bellow: 1,
              });
            }
            // if (voting_data.eighteen_above === input.eighteen_above) {
            //     Party.votersAgeEstimatedPlusInParty(voting_data.party_id, {
            //       eighteen_above: -1,
            //     });

            // }else{

            // }
          }
          if (voting_data.party_id.toHexString() === input.party_id) {
            if (voting_data.eighteen_above !== input.eighteen_above) {
              if (input.eighteen_above) {
                Party.votersAgeEstimatedPlusInParty(input.party_id, {
                  eighteen_above: 1,
                });
                Party.votersAgeEstimatedPlusInParty(input.party_id, {
                  eighteen_bellow: -1,
                });
              } else {
                Party.votersAgeEstimatedPlusInParty(input.party_id, {
                  eighteen_above: -1,
                });
                Party.votersAgeEstimatedPlusInParty(input.party_id, {
                  eighteen_bellow: 1,
                });
              }
            }
          }

          Voting.findOneAndUpdate(
            { _id: input.id },
            {
              $set: {
                party_id: input.party_id,
                voting_date: input.voting_date,
                eighteen_above: input.eighteen_above,
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
        if (input.eighteen_above) {
          Party.votersAgeEstimatedPlusInParty(input.party_id, {
            eighteen_above: 1,
          });
        } else {
          Party.votersAgeEstimatedPlusInParty(input.party_id, {
            eighteen_bellow: 1,
          });
        }
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

  async feedbackAdd(req, res, next) {
    try {
      let input = halper.obj_multi_select(
        req.body,
        ['party_id', 'select1', 'select2', 'description', 'email'],
        false,
      );
      input.createdAt = custom_date();
      Feedback.addFeedback(input);
      Party.getPartyById(input.party_id, (err, resdata) => {
        // console.log(resdata.email);
        mail.sand(
          resdata.email,
          'Feedback',
          MailTemplate.user_registration({ description: input.description }),
        );
      });
      return res
        .status(200)
        .json(
          halper.api_response(1, halper.request_message('feedbackAdd'), input),
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
      // QuestionAnswer;
      let input = halper.obj_multi_select(
        req.body,
        ['question_id', 'value', 'device_id'],
        false,
      );
      if (check_obj(req.headers, 'authorization')) {
        const user = await jwt.verify(
          req.headers.authorization,
          accessTokenSecret,
        );
        input.user_id = user.user_id;
      }
      input.answer_date = current_date();
      let question_s = await Question.getQuestionFromID(input.question_id);
      let question_data = await QuestionAnswer.checkQuestionAnswer(input);
      let question_for_date = await QuestionAnswer.checkQuestionAnswerFromDate(
        input,
      );
      // console.log('question_data', question_for_date);
      if (
        check_obj(question_data) ||
        (change_time_format(question_s.createdAt, 'YYYY-MM-DD') ===
          input.answer_date &&
          check_obj(question_for_date))
      ) {
        return res
          .status(200)
          .json(
            halper.api_response(
              0,
              halper.request_message('already_submitted_answered'),
              input,
            ),
          );
      } else {
        submitted_answer.answer_estimated = 1;
        submitted_answer[`select_${input.value}`] = 1;
        Question.questionEstimatedPlus(input.question_id, submitted_answer);
        let question_answer = halper.obj_multi_select(input, [
          'user_id',
          'question_id',
          'device_id',
          'answer_date',
        ]);
        QuestionAnswer.addQuestionAnswer(question_answer);
        return res
          .status(200)
          .json(
            halper.api_response(
              1,
              halper.request_message('already_submitted'),
              input,
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

  async voteShedule(req, res, next) {
    try {
      let input = halper.obj_multi_select(
        req.body,
        ['device_id', 'voter_type', 'eighteen_above'],
        false,
      );
      input.createdAt = new Date();
      // addVoteSchedule;

      // if (
      //     change_time_format(input.voting_date, 'YYYY-MM-DD') ===
      //     change_time_format(voting_data.voting_date, 'YYYY-MM-DD')
      //   )

      let checkVoteShedule = await VoteSchedule.getVoteSchedule(
        input.device_id,
      );
      if (
        check_obj(checkVoteShedule) &&
        change_time_format(input.createdAt, 'YYYY-MM-DD') ===
          change_time_format(checkVoteShedule.createdAt, 'YYYY-MM-DD')
      ) {
        return res
          .status(200)
          .json(
            halper.api_response(
              0,
              halper.request_message('voteSheduleCheck'),
              input,
            ),
          );
      } else {
        if (check_obj(checkVoteShedule)) {
          if (checkVoteShedule.voter_type === 'another_party') {
            Configration.configrationPlusShedule('another_party', {
              count: -1,
            });
            if (checkVoteShedule.eighteen_above) {
              Configration.configrationPlusShedule('another_party', {
                eighteen_above: -1,
              });
            } else {
              Configration.configrationPlusShedule('another_party', {
                eighteen_bellow: -1,
              });
            }
          }
          if (checkVoteShedule.voter_type === 'have_not_decided') {
            Configration.configrationPlusShedule('have_not_decided', {
              count: -1,
            });
            if (checkVoteShedule.eighteen_above) {
              Configration.configrationPlusShedule('have_not_decided', {
                eighteen_above: -1,
              });
            } else {
              Configration.configrationPlusShedule('have_not_decided', {
                eighteen_bellow: -1,
              });
            }
          }
          if (checkVoteShedule.voter_type === 'i_will_not_vote') {
            Configration.configrationPlusShedule('i_will_not_vote', {
              count: -1,
            });
            if (checkVoteShedule.eighteen_above) {
              Configration.configrationPlusShedule('i_will_not_vote', {
                eighteen_above: -1,
              });
            } else {
              Configration.configrationPlusShedule('i_will_not_vote', {
                eighteen_bellow: -1,
              });
            }
          }
        }
        if (input.voter_type === 'another_party') {
          Configration.configrationPlusShedule('another_party', { count: 1 });
          if (input.eighteen_above) {
            Configration.configrationPlusShedule('another_party', {
              eighteen_above: 1,
            });
          } else {
            Configration.configrationPlusShedule('another_party', {
              eighteen_bellow: 1,
            });
          }
        }
        if (input.voter_type === 'have_not_decided') {
          Configration.configrationPlusShedule('have_not_decided', {
            count: 1,
          });
          if (input.eighteen_above) {
            Configration.configrationPlusShedule('have_not_decided', {
              eighteen_above: 1,
            });
          } else {
            Configration.configrationPlusShedule('have_not_decided', {
              eighteen_bellow: 1,
            });
          }
        }
        if (input.voter_type === 'i_will_not_vote') {
          Configration.configrationPlusShedule('i_will_not_vote', { count: 1 });
          if (input.eighteen_above) {
            Configration.configrationPlusShedule('i_will_not_vote', {
              eighteen_above: 1,
            });
          } else {
            Configration.configrationPlusShedule('i_will_not_vote', {
              eighteen_bellow: 1,
            });
          }
        }

        if (check_obj(checkVoteShedule)) {
          VoteSchedule.findOneAndUpdate(
            { _id: checkVoteShedule.id },
            {
              $set: input,
            },
            {
              returnNewDocument: true,
            },
            function (err, docs) {},
          );
        } else {
          VoteSchedule.addVoteSchedule(input);
        }

        return res
          .status(200)
          .json(
            halper.api_response(
              1,
              halper.request_message('voteShedule'),
              input,
            ),
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

  async getQuestion(req, res, next) {
    try {
      let response = [];
      let input = halper.obj_multi_select(req.body, ['device_id']);
      let all_questions = await Question.getQuestion();
      for (let all_question of all_questions) {
        all_question = all_question.toObject();
        all_question.is_user_answer = await QuestionAnswer.checkQuestionAnswer({
          question_id: all_question._id,
          device_id: input.device_id,
        });
        all_question.is_user_answer = check_obj(all_question.is_user_answer)
          ? 1
          : 0;
        response.push(all_question);
      }
      return res
        .status(200)
        .json(
          halper.api_response(
            1,
            halper.request_message('question_list'),
            filterApiQuestion(response),
          ),
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

  async verifyVersion(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['device_token']);
      push_notification_single(
        'Det finns en nyare version av appen som du kommer att uppskatta. Denna måste du uppgradera till för att appen ska fungera',
        'ROSTA RATT',
        input.device_token,
      );
      return res
        .status(200)
        .json(
          halper.api_response(1, halper.request_message('verifyVersion'), input),
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

  async storeVersion(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['version']);
      let configration = await Configration.getConfigrationByID('version');
      if (check_obj(configration)) {
        if(parseFloat(configration.value) < parseFloat(input.version)){
          Configration.updateConfigrationByID(
            { id: configration._id.toString(), value: input.version },
            function (err, resData) {
              return resData;
            },
          );
        }
      } else {
        Configration.saveConfigration({
          name: 'version',
          value: input.version,
        });
      }
      return res
        .status(200)
        .json(
          halper.api_response(1, halper.request_message('storeVersion'), input),
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
        'another_party',
        'have_not_decided',
        'i_will_not_vote',
        'version',
      ]);
      return res
        .status(200)
        .json(
          halper.api_response(1, halper.request_message('info_list'), response),
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

  async getParty(req, res, next) {
    try {
      let small_party_response = [];
      let big_party_response = [];
      let configration = await Configration.getConfigrationByID('party');
      let resdata = await Party.getAllParty(configration.value);
      // let userCount = await Voting.getVotingCount();
      let button_name = await Configration.getInfoConfigration([
        'another_party',
        'have_not_decided',
        'i_will_not_vote',
      ]);
      for (let resdat of resdata) {
        resdat = resdat.toObject();
        resdat.collaboration = await Collaboration.getCollaborationFromParty(
          resdat._id,
        );
        if (!check_obj(resdat.collaboration)) {
          resdat.collaboration = {};
        }
        if (resdat.small_party === '1') {
          small_party_response.push(resdat);
        } else {
          big_party_response.push(resdat);
        }
      }
      let sifo_data = await Configration.getInfoSelectConfigration(
        ['sifo_all_parties', 'sifo_yes'],
        ['name', 'value'],
      );
      let small_party_response_count = halper.sum_array(
        halper.filter_by_id(small_party_response, 'voters_estimated'),
      );
      let big_party_response_count = halper.sum_array(
        halper.filter_by_id(big_party_response, 'voters_estimated'),
      );
      let userCount = small_party_response_count + big_party_response_count;
      return res.status(200).json(
        halper.api_response(1, halper.request_message('all_party'), {
          total_voters: userCount,
          button_name: button_name,
          sifo_data: sifo_data,
          small_party: small_party_response,
          big_party: big_party_response,
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
      let checkVal = await Party.removePartyImage(
        '62349988e733f58e8f44217b',
        'party_image/1647614344148amex.jpg',
      );
      // console.log(checkVal);
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
      let myrsData = [];
      // console.log(randomValueHex());
      User.getUsers(100, (err, resdatas) => {
        for (let resdata of resdatas) {
          // User.updateUserData(resdata._id, { $inc: { my_id: 1 } });
          // User.updateUserData(resdata._id, { my_id: randomValueHex() });
          myrsData.push(resdata);
        }
        return res
          .status(200)
          .json(halper.api_response(1, 'user list', myrsData));
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
}

module.exports = new apiController();

