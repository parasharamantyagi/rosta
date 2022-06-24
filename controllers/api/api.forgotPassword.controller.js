const halper = require('../../halpers/halper');
const User = require('./../../Model/userTable');
const Otp = require('./../../Model/otpTable');
const mail = require('./../../halpers/mail');
const MailTemplate = require('./../../halpers/mail_template');
const multer = require('multer');
const {
  check_obj,
  custom_date,
  change_time_format,
  current_date,
  randomValueHex,
} = require('../../halpers/halper');
const { rn } = require('../../Model/module');

class apiForgotPasswordController {
  async updatePassword(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['email', 'new_password','old_password']);
      let checkUser = await User.getUserByEmail(input.email);
      if (check_obj(checkUser) && checkUser.password == input.old_password) {
        if (check_obj(input, 'new_password')) {
          input.password = halper.encrypt(input.new_password);
        }
        User.updateUserData(checkUser._id, { password: input.password });
        return res
          .status(200)
          .json(
            halper.api_response(1, 'Your password has been changed', input),
          );
      } else {
        return res
          .status(200)
          .json(
            halper.api_response(
              0,
              halper.request_message('invalid_request'),
              {},
            ),
          );
      }
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async changePassword(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['email', 'password']);
      let checkUser = await User.getUserByEmail(input.email);
      if (check_obj(checkUser)) {
        if (check_obj(input, 'password')) {
          input.password = halper.encrypt(input.password);
        }
        User.updateUserData(checkUser._id, { password: input.password });
        return res
          .status(200)
          .json(
            halper.api_response(1, 'Your password has been changed', input),
          );
      } else {
        return res
          .status(200)
          .json(
            halper.api_response(
              0,
              halper.request_message('invalid_request'),
              {},
            ),
          );
      }
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async verifyOtp(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['email', 'otp']);
      let check_email_otp = await Otp.getOtpFromEmail(input.email);
      if (check_obj(check_email_otp)) {
        if (check_email_otp.otp == input.otp) {
          return res
            .status(200)
            .json(
              halper.api_response(1, 'Your otp matches successfully', input),
            );
        } else {
          return res
            .status(200)
            .json(halper.api_response(0, 'This is invalid otp', input));
        }
      } else {
        return res
          .status(200)
          .json(
            halper.api_response(
              0,
              halper.request_message('invalid_request'),
              {},
            ),
          );
      }
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async forgotPassword(req, res, next) {
    try {
      let input = halper.obj_multi_select(req.body, ['email']);
      let checkUser = await User.getUserByEmail(input.email);
      if (check_obj(checkUser)) {
        input.otp = rn({ min: 11111, max: 99999, integer: true });
        mail.sand(
          'aman24june@yopmail.com',
          'Forgot Password',
          `Your one time otp is ${input.otp}`,
        );
        let check_email_otp = await Otp.getOtpFromEmail(input.email);
        if (check_obj(check_email_otp)) {
          Otp.updateOtpFromEmail(input.email, input.otp);
        } else {
          Otp.addOtpEmail(input);
        }
        return res
          .status(200)
          .json(
            halper.api_response(
              1,
              'Please check your email and verify your otp',
              input,
            ),
          );
      } else {
        return res
          .status(200)
          .json(
            halper.api_response(
              0,
              'This email does not exist in our record',
              {},
            ),
          );
      }
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new apiForgotPasswordController();
