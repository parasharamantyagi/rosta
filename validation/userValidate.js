const { body, validationResult } = require('express-validator')

module.exports.validate  = (method) => {
  switch (method) {
    case 'logIn': {
      return [
        body('email', 'email doesn exists').exists().isEmail(),
        body('password', 'password doesn exists').exists(),
      ];
    }
    case 'createUser': {
      return [
        body('username', 'username doesn exists').exists(),
        body('email', 'Invalid email').exists().isEmail(),
      ];
    }
  }
}