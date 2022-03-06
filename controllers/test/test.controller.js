const halper = require('../../halpers/halper');
const UserList = require('./../../Model/userListTable');

class testController {

  async getUser(req, res, next) {
    try {
      // 29.711228,77.487360
      UserList.getUserList([29.711228, 77.487360], (err, user_list) => {
        console.log(err);
        if (err) return res
          .status(200)
          .json(halper.api_response(1, 'invalid_request', err));
        return res
          .status(200)
          .json(halper.api_response(1, 'get all user list', user_list));
      });
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }

  async addUser(req, res, next) {
    try {
      let inputData = halper.obj_multi_select(req.body);
      UserList.addUserList(inputData, async (err, resdata) => {
        return res
        .status(200)
        .json(
          halper.api_response(1, halper.request_message('dashboard'), resdata),
        );
      });
      
    } catch (err) {
      return res.json(
        halper.api_response(0, halper.request_message('invalid_request'), {}),
      );
    } finally {
    }
  }
}

module.exports = new testController();

