const { body, validationResult } = require('express-validator')

module.exports.validate  = (method) => {
  switch (method) {
    case 'updatePassword': {
      return [
        body('password', 'password doesn exists').exists().isLength({ min: 6 }),
      ];
    }
    case 'getUnit': {
      return [
        body('status', 'status doesn exists').exists().isLength({ min: 3 }),
      ];
    }
  }
}