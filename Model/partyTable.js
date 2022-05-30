var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');

var partySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    short_name: { type: String, required: true },
    dd: { type: Number, enum: [1, 0], default: 0 },
    voters_estimated: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    image_link: [{ type: String }],
    email: { type: String },
    small_party: { type: String, enum: ['1', '0'], default: '0' },
    sifo_factor: { type: Number, enum: [1, 0], default: 0 },
    url: { type: String },
    description: { type: String },
    total_voters_estimated: { type: String },
    bar_in_diagram: { type: String },
    vote_percentage: { type: String },
    eighteen_above: { type: Number, default: 0 },
    eighteen_bellow: { type: Number, default: 0 },
    createdAt: { type: Date },
    UpdatedAt: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Party = (module.exports = mongoose.model('party', partySchema));

//get all users
module.exports.getParty = function (limit, callback) {
    Party.find().limit(limit).exec(callback);
}

//get all users
module.exports.getAllParty = async (value) => {
  return await Party.find().sort({ name: parseInt(value) }).exec();
};

//get all users
module.exports.getSelectFieldAllParty = async (value) => {
  return await Party.find()
    .select([
      '_id',
      'name',
      'bar_in_diagram',
      'short_name',
      'small_party',
      'voters_estimated',
      'eighteen_above',
      'eighteen_bellow',
      'vote_percentage',
      'total_voters_estimated',
      'sifo_factor',
    ])
    .sort({ name: parseInt(value) })
    .exec();
};


//get all party count
module.exports.getPartyCount = async function (callback) {
  try {  return await Party.count().exec(callback);
    } catch(err) { return err; }
};

//get all users
module.exports.removePartyImage = async (id,value) => {
  // return await Party.find().sort({ name: parseInt(value) }).exec();
  return await Party.findOneAndUpdate({ _id: id }, { $pullAll: {image_link: [value] } });
  // Favorite.updateOne( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] } } )
};

//add admin
module.exports.addParty = function (data, callback) {
  var query = { name: data.name };
  var update = {
    name: data.name,
    short_name: data.short_name,
    image_link: data.image_link,
    email: data.email,
    small_party: data.small_party,
    sifo_factor: data.sifo_factor,
    bar_in_diagram: data.bar_in_diagram,
    total_voters_estimated: data.total_voters_estimated,
    url: data.url,
    description: data.description,
    createdAt: new Date(),
  };
  Party.findOneAndUpdate(
    query,
    update,
    { upsert: true, new: true },
    callback,
  );
};

module.exports.updateParty = function (data, callback) {
  var query = { _id: data.id };
  var update = {
    name: data.name,
    short_name: data.short_name,
    // image_link: data.image_link,
    email: data.email,
    small_party: data.small_party,
    sifo_factor: data.sifo_factor,
    url: data.url,
    description: data.description,
    bar_in_diagram: data.bar_in_diagram,
    total_voters_estimated: data.total_voters_estimated,
  };
  if(check_obj(data, 'image_link')){
    Party.findOneAndUpdate(query, { $push: { image_link: data.image_link } },function(error,success){
      if (error) {
        console.log(error);
      } else {
        console.log(success);
      }
    });
  }
  Party.findOneAndUpdate(query, update, { upsert: true, new: true }, callback);
}

module.exports.votersAgeEstimatedPlusInParty = async (id,key_name) => {
  return await Party.findOneAndUpdate(
    { _id: id },
    { $inc: key_name },
    { new: true },
  );
};

module.exports.votersEstimatedPlusInParty = async (data) => {
  return await Party.findOneAndUpdate(
    { _id: data },
    { $inc: { voters_estimated: 1 } },
    { new: true },
  );
};

module.exports.votersEstimatedMinusInParty = async (data) => {
  return await Party.findOneAndUpdate(
    { _id: data },
    { $inc: { voters_estimated: -1 } },
    { new: true },
  );
}

module.exports.adminLogin = function (data, callback) {
    var query = { email: data.email, password: data.password };
    return Party.findOne(query, callback);
}

module.exports.getPartyById = function (id, callback) {
  var query = { _id: id };
  return Party.findOne(query, callback);
};

module.exports.getUsersWithFilter = function (obj,sortByField,sortOrder,paged,pageSize, callback) {
    Party.aggregate([{$match:obj},
        {$match:{role:{$ne :"ADMIN"}}},
        {$sort :{[sortByField]:  parseInt(sortOrder)}},
        {$skip: (paged-1)*pageSize},
        {$limit: parseInt(pageSize) },
      ],callback);
}

module.exports.removeParty = (id, callback) => {
  var query = { _id: id };
  Party.remove(query, callback);
};