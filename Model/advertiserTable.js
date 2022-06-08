var mongoose = require('mongoose');
const { check_obj } = require('../halpers/halper');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

var advertiserSchema = mongoose.Schema(
  {
    ad_campaign_name: { type: String },
    target_group: [{ type: String }],
    target_group_id: [{ type: String }],
    cpm_cpc_settings: { type: String },
    budget_per_day: { type: String },
    cpc_cost_per_click: { type: String },
    campaign_dates: { type: String },
    ad_material_url: { type: String },
    target_url: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

const Advertiser = (module.exports = mongoose.model('advertisers', advertiserSchema));

//get all users
module.exports.getAdvertiser = function (limit, callback) {
  Advertiser.find().sort({ _id: -1 }).limit(limit).exec(callback);
};

module.exports.addAdvertiser = function (data, callback) {
  Advertiser.create(data, callback);
};

module.exports.removeAdvertiser = (id, callback) => {
  var query = { _id: id };
  Advertiser.remove(query, callback);
};