var mongoose = require('mongoose');
const { check_obj, randomValueHex } = require('../halpers/halper');

var userSchema = mongoose.Schema(
  {
    email: { type: String },
    dob: { type: String },
    is_verified: { type: Number, enum: [1, 0], default: 0 },
    age_verification: { type: Number, enum: [1, 0], default: 0 },
    physical_user: { type: Number, enum: [1, 0], default: 0 },
    user_name: { type: String },
    nick_name: { type: String },
    add_title: { type: String },
    add_subtitle: { type: String },
    add_logo: { type: String },
    password: { type: String, default: 'none' },
    hint: { type: String, default: '0' },
    alias: { type: String, default: 'none' },
    gdpr: { type: String, default: '0' },
    uuid: { type: String, required: true, default: '0' },
    my_id: { type: String, default: '0' },
    device_token: { type: String },
    frequency: { type: String },
    createdAt: { type: Date },
    UpdatedAt: { type: Date },
    is_premium: { type: Number, default: 0 },
    is_use_referral_code: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ['user', 'admin', 'advertiser'],
      default: 'user',
    },
    referral_code: [{ type: String }],
    competetion: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'competitions' },
    ],
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

//userSchema.index({ userLocation:"2dsphere" })

const User = (module.exports = mongoose.model('users', userSchema));

//get all users
module.exports.getUsers = function (limit, callback) {
  User.find().limit(limit).exec(callback);
};

//get all users
module.exports.getUsersAdvertiser = function (limit, callback) {
  User.find({ role: 'advertiser' }).limit(limit).exec(callback);
};

//get all users
module.exports.getUsersWithCompetition = async function (limit, callback) {
  return User.find({ competetion: { $ne: null } }).select(['_id','uuid', 'role','gdpr','alias','age_verification','is_premium','referral_code','competetion']).populate({ path: 'competetion' }).limit(limit).exec(callback);
};


//get all users
module.exports.getUsersDeviceToken = async function (limit, callback) {
  return User.find({ device_token: { $ne: null } }).select(['device_token']).limit(limit).exec(callback);
};

//get user by email
module.exports.getUserCompetitionByUuid = async(data, callback) => {
  return User.find({ competetion: { $ne: null }}).select(['_id','uuid', 'role','gdpr','alias','age_verification','is_premium','referral_code','competetion']).populate({ path: 'competetion' }).exec(callback);
}

//get all users count
module.exports.getUsersCount = async function (callback) {
  try {  return await User.count().exec(callback);
    } catch(err) { return err; }
};

//add admin

module.exports.addCompetetion = function (user_id, competetion, callback) {
  var query = { _id: user_id };
  User.findOneAndUpdate(query, { $push: { competetion: competetion } },function(error,success){
      if (error) {
        console.log(error);
      } else {
        console.log(success);
      }
    });
};


//add is_premium

module.exports.addPremiumUser = async function (user_id, callback) {
  var query = { _id: user_id };
  let uuu = await User.findOneAndUpdate(query, { is_premium:1 }, callback);
  return true;
};

module.exports.addUser = function (data, callback) {
  data.my_id = randomValueHex();
  User.create(data, callback);
}

module.exports.addUserAsync = async function (data, callback) {
  data.my_id = randomValueHex();
  return await User.create(data, callback);
};

module.exports.addReferralCode = function (data, callback) {
  User.findOneAndUpdate({uuid: data.id}, { $push: { referral_code: data.referral_code } },function(error,success){
      if (error) {
        console.log(error);
      } else {
        User.findOneAndUpdate({ my_id: data.referral_code }, { is_use_referral_code : 1}, { upsert: true }, function(err,successss){
          console.log(successss);
        });
      }
    });
  
};

//get user by email


module.exports.getUserByReferralCode = async (data, callback) => {
  try {
    return await User.findOne({ referral_code: data }).exec(callback);
  } catch (err) {
    return err;
  }
};

module.exports.getUserByUuidOrMyId = async (data, callback) => {
  try {
    return await User.findOne({ $or: [ { my_id: data }, { uuid: data } ]}).exec(callback);
  } catch (err) {
    return err;
  }
};

module.exports.getUserByUuid = async(data, callback) => {
  try {
    var query = await User.findOne({ uuid: data }).exec(callback);
    if (check_obj(query)){
      return query;
    }else{
      if (data.match(/^[0-9a-fA-F]{24}$/)) {
        return await User.findOne({ _id: data }).exec(callback);
      } else {
        return {};
      }
    }
  } catch (err) {
    return err;
  }
}


module.exports.getUserByOnlyUuid = async (data, callback) => {
  try {
      return await User.findOne({ uuid: data }).exec(callback);
  } catch (err) {
    return err;
  }
};

//get user by email
module.exports.getUserByEmail = (data, callback) => {
  try {
    var query = { email: data };
    return User.findOne(query, callback);
  } catch (err) {
    return err;
  }
}

module.exports.getUsersWithFilter = function (obj,sortByField,sortOrder,paged,pageSize, callback) {
    User.aggregate([{$match:obj},
        {$match:{role:{$ne :"admin"}}},
        {$sort :{[sortByField]:  parseInt(sortOrder)}},
        {$skip: (paged-1)*pageSize},
        {$limit: parseInt(pageSize) },
      ],callback);
}


module.exports.addAdmin = function (data, callback) {
    var query = { email: data.email };
    var update = {
      // uuid: data.uuid,
      email: data.email,
      dob: data.dob,
      user_name: data.user_name,
      password: data.password,
      role: data.role,
      createdAt: new Date(),
    };
    User.findOneAndUpdate(query, update, { upsert: true, fields: { password: 0 }, new: true }, callback)
}

module.exports.updateStatus = function (data, callback) {
  var query = { _id: data.id };
    var update = {
      is_verified: data.is_verified,
    };
    User.findOneAndUpdate(query, update, { upsert: true, fields: { password: 0 }, new: true }, callback)
}

module.exports.updateUserData = async(id ,update, callback) => {
    return await User.findOneAndUpdate({ _id: id }, update, { upsert: true, fields: { password: 0 }, new: true }, callback);
}

module.exports.findUserByMyId = async(id, callback) => {
  return User.findOne({ my_id: id }, callback);
}

module.exports.adminLogin = function (data, callback) {
    var query = { email: data.email, password: data.password };
    return User.findOne(query, callback);
}

module.exports.removeUser = (id, callback) => {
  var query = { _id: id };
  User.remove(query, callback);
};