var mongoose = require('mongoose');
const { check_obj, randomValueHex } = require('../halpers/halper');

var otpSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Otp = (module.exports = mongoose.model('otps', otpSchema));

module.exports.getOtpFromEmail = async (data, callback) => {
  try {
    return await Otp.findOne({ email: data }).exec(callback);
  } catch (err) {
    return err;
  }
};

module.exports.updateOtpFromEmail = async function (email, otp, callback) {
  return await Otp.updateOne({ email: email }, { otp: otp }, callback);
};

module.exports.addOtpEmail = function (data, callback) {
  Otp.create(data, callback);
};
