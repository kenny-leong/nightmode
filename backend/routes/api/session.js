// Phase 4:
const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

// Phase 5:
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Phase 5: Validate login info middleware
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
];

// Phase 4: POST /api/session (Log In a User)
router.post('/', async (req, res, next) => {
      const { credential, password } = req.body;

      //Body Validation error handling
      if (!credential) {
        return res.status(400).json({
          message: "Validation error",
          statusCode: 400,
          error: "Email or username is required"
        });
      }
      if(!password) {
        return res.status(400).json({
          message: "Validation error",
          statusCode: 400,
          error: "Password is required"
        });
      }

      const user = await User.login({ credential, password });

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
          statusCode: 401
        });
      }

      setTokenCookie(res, user);

      const returnObj = {};

      returnObj.id = user.id;
      returnObj.firstName = user.firstName;
      returnObj.lastName = user.lastName;
      returnObj.email = user.email;
      returnObj.username = user.username;

      return res.json({
        user: returnObj
      });
    }
);

// Phase 4: Log out
router.delete('/',(_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
);

// Phase 4: Restore session user
router.get('/', restoreUser, (req, res) => {
  const { user } = req;

  if (user) {
    const returnObj = {};

    returnObj.id = user.id;
    returnObj.firstName = user.firstName;
    returnObj.lastName = user.lastName;
    returnObj.email = user.email;
    returnObj.username = user.username;

    return res.json({ user: returnObj });
  } else {
    return res.json({ user: null });
  }
}

);

module.exports = router;
