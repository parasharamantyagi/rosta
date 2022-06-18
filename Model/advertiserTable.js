var mongoose = require('mongoose');
const { check, check_obj } = require('../halpers/halper');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

var advertiserSchema = mongoose.Schema(
  {
    user_id: { type: String },
    ad_campaign_name: { type: String },
    target_group: [{ type: String }],
    target_group_id: [{ type: String }],
    cpm_cpc_settings: { type: String },
    budget_per_day: { type: String },
    cpc_cost_per_click: { type: String },
    campaign_dates: { type: String },
    ad_material_url: { type: String },
    age: { type: String },
    after_vote: { type: String },
    target_url: { type: String },
    ad_frequency: { type: String },
    add_ranking: { type: String },
    link_url: { type: String },
    description_text: { type: String },
    background_color: { type: String },
    text_color: { type: String },
    ad_name: { type: String },
    link_name: { type: String },
    add_title: { type: String },
    add_subtitle: { type: String },
    add_logo: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Advertiser = (module.exports = mongoose.model('advertisers', advertiserSchema));


//get all users
module.exports.getSelectedAdvertiser = function (limit, callback) {
  if (check(limit)) {
    return Advertiser.find({ user_id: limit }).sort({ _id: -1 }).exec(callback);
  }
  return Advertiser.find().sort({ _id: -1 }).exec(callback);
};

//get all users
module.exports.getAdvertiser = function (limit, callback) {
  return Advertiser.find().sort({ _id: -1 }).limit(limit).exec(callback);
};

module.exports.addAdvertiser = function (data, callback) {
  Advertiser.create(data, callback);
};

module.exports.removeAdvertiser = (id, callback) => {
  var query = { _id: id };
  Advertiser.remove(query, callback);
};