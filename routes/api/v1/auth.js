const express = require('express');
const validator = require('validator');
const passport = require('passport');
const moment = require('moment');
const User = require('mongoose').model('User');

const router = new express.Router();

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload, callback) {
  // find if user with the same email exists in database
  User.findOne({ email: payload.email}, (err, user) => {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
      isFormValid = false;
      errors.email = 'Please provide a correct email address.';
    }

    // error if user attempts to register with an email already registered
    if (user !== null) {
      isFormValid = false;
      errors.email = 'This email is already taken.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
      isFormValid = false;
      errors.password = 'Password must have at least 8 characters.';
    }

    if (!payload || typeof payload.firstName !== 'string' || payload.firstName.trim().length === 0) {
        isFormValid = false;
        errors.firstName = 'Please provide your name.';
      }

    if (!payload || typeof payload.lastName !== 'string' || payload.lastName.trim().length === 0) {
      isFormValid = false;
      errors.lastName = 'Please provide your last name.';
    }

    const dateFormat = "DD/MM/YYYY";

    if (!payload || !moment((payload.dob.trim()), dateFormat).isValid() || payload.dob.trim().length === 0) {
      isFormValid = false;
      errors.dob = 'Please provide your date of birth in the correct format (DD/MM/YYY).';
    }

    if (!payload || typeof payload.line1 !== 'string' || payload.line1.trim().length === 0) {
      isFormValid = false;
      errors.line1 = 'Please provide your address.';
    }

    if (!payload || typeof payload.suburb !== 'string' || payload.suburb.trim().length === 0) {
      isFormValid = false;
      errors.suburb = 'Please provide your suburb.';
    }

    if (!payload || typeof payload.state !== 'string' || payload.state.trim().length === 0) {
      isFormValid = false;
      errors.state = 'Please provide your state.';
    }

    if (!payload || typeof payload.pcode !== 'string' || payload.pcode.trim().length === 0) {
      isFormValid = false;
      errors.pcode = 'Please provide your post code.';
    }

    if (!isFormValid) {
      message = 'Please check the form for errors:';
    }

    const validation = {
      success: isFormValid,
      message,
      errors
    };

    callback(validation);
  });
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Please provide your email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Please check the form for errors:';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/signup', (req, res, next) => {
  validateSignupForm(req.body, (validationResult) => {
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }

    return passport.authenticate('local-signup', (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Error: Failed to process the form.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'You have successfully signed up! Please log in using your email and password.'
      });
    })(req, res, next);
  })
});

router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Error: Failed to process the form.'
      });
    };
    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
});

module.exports = router;
