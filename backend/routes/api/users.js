// Phase 4:
const express = require('express')

const router = express.Router();

const { User } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



// Phase 5: Validate signup info middleware (NOT NEEDED)
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Phase 4: POST /api/users (Sign Up a User)
router.post('/', async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;

      // req body validations
      if (!firstName) {
        return res.status(400).json({
          message: "Validation error",
          statusCode: 400,
          error: "First Name is required"
        });
      }
      if (!lastName) {
        return res.status(400).json({
          message: "Validation error",
          statusCode: 400,
          error: "Last Name is required"
        });
      }
      if (!username) {
        return res.status(400).json({
          message: "Validation error",
          statusCode: 400,
          error: "Username is required"
        });
      }
      if (username.length < 4 || username.length > 30) {
        return res.status(400).json({
          message: 'Username must be between 4 - 30 characters',
          statusCode: 400,
          error: 'Invalid username length'
        });
      }
      if ((!email.includes('@')) || email.length < 3 || email.length > 256) {
        return res.status(400).json({
          message: "Validation error",
          statusCode: 400,
          error: "The provided email is invalid"
        });
      }

      //get all existing users
      const allUsers = await User.findAll();

      //build up error obj
      const err = {
        message: "User already exists",
        statusCode: 403
      };

      //helper fxn
      function errHandle(err) {
        return res.status(403).json(err);
      }

      // username and email validations
      for (let user of allUsers) {
        if (user.email == email) {
          err.error = "User with that email already exists";
          return errHandle(err);
        }
        if (user.username == username) {
          err.error = "User with that username already exists";
          return errHandle(err);
        }
      }

      const newUser = await User.signup({ email, username, password, firstName, lastName });

      setTokenCookie(res, newUser);


      const returnObj = {};
      returnObj.id = newUser.id;
      returnObj.firstName = firstName;
      returnObj.lastName = lastName;
      returnObj.email = email;
      returnObj.username = username;


      return res.json({
        user: returnObj
      });
    }
);

module.exports = router;
