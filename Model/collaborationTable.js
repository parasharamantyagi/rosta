var mongoose = require('mongoose');

var collaborationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    party_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'party' }],
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

//userSchema.index({ userLocation:"2dsphere" })

const Collaboration = (module.exports = mongoose.model('collaborations', collaborationSchema));

//get all votings
module.exports.getCollaboration = function (limit, callback) {
  Collaboration.find()
    .populate({ path: 'party_id' })
    .limit(limit)
    .exec(callback);
};

//get all votings
module.exports.getCollaborationFromParty = async (data) => {
  return await Collaboration.findOne({ party_id: data }, 'name').exec();
  // .populate({ path: 'party_id' })
  // .limit(limit)
};

//add votings
module.exports.addCollaboration = function (data, callback) {
  Collaboration.create(data, callback);
};

module.exports.removeCollaboration = (id, callback) => {
  var query = { _id: id };
  Collaboration.remove(query, callback);
};