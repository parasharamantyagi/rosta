var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');

var userSchema = mongoose.Schema(
  {
    email: { type: String },
    dob: { type: String },
    is_verified: { type: Number, enum: [1, 0], default: 0 },
    age_verification: { type: Number, enum: [1, 0], default: 0 },
    physical_user: { type: Number, enum: [1, 0], default: 0 },
    user_name: { type: String },
    nick_name: { type: String },
    password: { type: String, default: 'none' },
    hint: { type: String, default: '0' },
    alias: { type: String, default: 'none' },
    gdpr: { type: String, default: '0' },
    uuid: { type: String, default: '0' },
    frequency: { type: String },
    createdAt: { type: Date },
    UpdatedAt: { type: Date },
    is_premium: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    referral_code: [{ type: String }],
    competetion: { type: mongoose.Schema.Types.ObjectId, ref: 'competitions' },
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
module.exports.getUsersWithCompetition = async function (limit, callback) {
  return User.find({ competetion: { $ne: null } }).select(['_id','uuid', 'role','gdpr','alias','age_verification','referral_code','competetion']).populate({ path: 'competetion' }).limit(limit).exec(callback);
};

//get all users count
module.exports.getUsersCount = async function (callback) {
  try {  return await User.count().exec(callback);
    } catch(err) { return err; }
};

//add admin

module.exports.addCompetetion = function (user_id, competetion, callback) {
  var query = { _id: user_id };
  var update = { competetion: competetion };
  User.findOneAndUpdate(
    query,
    update,
    { upsert: true, fields: { password: 0 }, new: true },
    callback,
  );
};


//add is_premium

module.exports.addPremiumUser = async function (user_id, callback) {
  var query = { _id: user_id };
  console.log(query);
  let uuu = await User.findOneAndUpdate(query, { is_premium:1 }, callback);
  console.log(uuu);
  return true;
};

module.exports.addUser = function (data, callback) {
  User.create(data, callback);
}

module.exports.addReferralCode = function (data, callback) {
  User.findOneAndUpdate({uuid: data.id}, { $push: { referral_code: data.referral_code } },function(error,success){
      if (error) {
        console.log(error);
      } else {
        console.log(success);
      }
    });
};

//get user by email
module.exports.getUserByUuid = async(data, callback) => {
  try {
    var query = await User.findOne({ uuid: data }).exec(callback);
    if (check_obj(query)){
      return query;
    }else{
      return await User.findOne({ _id: data }).exec(callback);
    }
  } catch (err) {
    return err;
  }
}

//get user by email
module.exports.getUserByEmail = (data, callback) => {
  try {
    var query = { email: data };
    // return User.findOne(query).exec(callback);
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

module.exports.updateUserData = function (id ,update, callback) {
     var query = { _id: id };
    User.findOneAndUpdate(query, update, { upsert: true, fields: { password: 0 }, new: true }, callback)
}

module.exports.adminLogin = function (data, callback) {
    var query = { email: data.email, password: data.password };
    // return User.findOne(query, 'walletCredit', callback);
    return User.findOne(query, callback);
}


// module.exports.getUsersWithFilter = function (obj,sortByField,sortOrder,paged,pageSize, callback) {
//     User.aggregate([{$match:obj},
//         {$match:{role:{$ne :"ADMIN"}}},
//         {$sort :{[sortByField]:  parseInt(sortOrder)}},
//         {$skip: (paged-1)*pageSize},
//         {$limit: parseInt(pageSize) },
//       ],callback);
// }

//add user 
// module.exports.addUser = function (data, callback) {
//     console.log("Inside update");
//     var query = { mobileNumber: data.mobileNumber };
//     var update = {
//         name: data.name,
//         email: data.email,
//         mobileNumber: data.mobileNumber,
//         password: data.password,
//         address: data.address,
//         //languageId: data.languageId,
//         //languageDetails: data.languageDetails,
//         profileImage: data.profileImage,
//         city: data.city,
//         countryCode: data.countryCode,
//         fbid: data.fbid,
//         gid: data.gid,
//         aid: data.aid,
//         token: data.token,
//         createdAt: new Date(),
//         role: "USER"
//     }
//     User.findOneAndUpdate(query, update, { upsert: true, fields: { password: 0 }, new: true }, callback)
// }