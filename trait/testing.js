const db = require('../db');
const { find_one, custom_date } = require('../halpers/halper');
const {
  ApiRequest,
} = require('../Model/table');

module.exports = {
  myCheck: myCheck,
};

async function myCheck(unit_id) {
  const qb = await db.get_connection();
  try {
    qb.insert(ApiRequest, { name: unit_id, created_on: custom_date() });
    return true;
  } catch (err) {
    qb.disconnect();
  }
}
