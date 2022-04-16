const { body, validationResult } = require('express-validator')

module.exports.validate  = (method) => {
  switch (method) {
    case 'createUser': {
      return [
        body('first_name', 'first_name doesn exists').exists(),
        body('last_name', 'last_name doesn exists').exists(),
        body('address', 'address doesn exists').exists(),
        body('email_id', 'email_id doesn exists').exists().isEmail(),
        body('phone_number', 'phone_number doesn exists').exists(),
        body('role_id', 'Invalid email').exists(),
        body('enabled', 'Invalid email').exists(),
      ];
    }
    case 'addCompetition': {
      return [
        body('party_id', 'party_id doesn exists').exists(),
        body('date', 'date doesn exists').exists(),
        body('percentage_value', 'percentage_value doesn exists').exists(),
        body('device_id', 'device_id doesn exists').exists(),
      ];
    }
    case 'createDriver': {
      return [
        body('first_name', 'first_name doesn exists').exists(),
        body('last_name', 'last_name doesn exists').exists(),
        body('email_id', 'email_id doesn exists').exists().isEmail(),
        body('phone_number', 'phone_number doesn exists').exists(),
      ];
    }
    case 'createCapability': {
      return [
        body('name', 'name doesn exists').exists(),
        body('description', 'description doesn exists').exists(),
      ];
    }
    case 'unitDriverVehicle': {
      return [
        body('start_time', 'start_time doesn exists').exists().isLength({ min: 15 }),
        body('end_time', 'end_time doesn exists').exists().isLength({ min: 15 }),
      ];
    }
    case 'createAccount': {
      return [
        body('name', 'name doesn exists').exists().isLength({ min: 1 }),
        body('address', 'address doesn exists').exists().isLength({ min: 1 }),
        body('postal_code', 'postal_code doesn exists')
          .exists()
          .isLength({ min: 1 }),
        body('country', 'country doesn exists').exists().isLength({ min: 1 }),
        body('billing_address', 'billing_address doesn exists')
          .exists()
          .isLength({ min: 1 }),
        body('billing_postal_code', 'billing_postal_code doesn exists')
          .exists()
          .isLength({ min: 1 }),
        body('billing_country', 'billing_country doesn exists')
          .exists()
          .isLength({ min: 1 }),
        body('as_physical_address', 'as_physical_address doesn exists')
          .exists()
          .isLength({ min: 1 }),
        body('phone', 'phone doesn exists').exists().isLength({ min: 1 }),
        body('first_name', 'first_name doesn exists')
          .exists()
          .isLength({ min: 1 }),
        body('last_name', 'last_name doesn exists')
          .exists()
          .isLength({ min: 1 }),
        body('contact_id', 'contact_id doesn exists')
          .exists()
          .isLength({ min: 1 }),
        body('email_id', 'email_id doesn exists').exists().isLength({ min: 1 }),
      ];
    }
  }
}