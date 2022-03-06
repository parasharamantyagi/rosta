const { select } = require('../Model/model');
const { OauthUsers, BaseUser } = require('../Model/table');
const { jwt, accessTokenSecret } = require('./../Model/module');

const jwt_token = async (input) => {
    try{
      const token = await jwt.verify(input.authorization, accessTokenSecret);
      switch (token.role_id) {
        case 1:
          return { status: true, role: 'driver_manager', data: token };
        case 2:
          return { status: true, role: 'dispatcher', data: token };
        case 3:
          return { status: true, role: 'drivers', data: token };
        case 4:
          return { status: true, role: 'reservationist', data: token };
        case 5:
          return { status: true, role: 'admin', data: token };
        case 6:
          return { status: true, role: 'manager', data: token };
        default:
          return { status: false};
      }
    } catch (err) {
      return { status: false };
    }
};

module.exports = {
  isAdmin: async (req, res, next) => {
    let check_token = await jwt_token(req.headers);
    if (check_token.status && check_token.role === 'admin') {
      next();
    } else {
      return res.status(401).json({
        status: 0,
        message: 'Invalid request',
        data: Object(),
      });
    }
  },
  isDriver: async (req, res, next) => {
    let check_token = await jwt_token(req.headers);
    if (check_token.status && check_token.role === 'drivers') {
      let check_valid = await select(OauthUsers, '*', {secret: req.headers.authorization});
      if (check_valid.length > 0) {
        next();
      }else{
        return res.status(401).json({
          status: 0,
          message: 'Invalid request',
          data: { message: 'This url is not authorized' },
        });
      }
    } else {
      return res.status(401).json({
        status: 0,
        message: 'Invalid request',
        data: Object(),
      });
    }
  },
  isUser: async (req, res, next) => {
    let check_token = await jwt_token(req.headers);
    if (check_token.status) {
      let check_valid = await select(OauthUsers, '*', {secret: req.headers.authorization});
      if (check_valid.length > 0) {
        next();
      } else {
        return res.status(401).json({
          status: 0,
          message: 'Invalid request',
          data: { message: 'This url is not authorized' },
        });
      }
    } else {
      return res.status(401).json({
        status: 0,
        message: 'Invalid request',
        data: { message: 'This url is not authorized' },
      });
    }
  },
};
