const validator = require('validator');

const MAILGUN_API = process.env.MAILGUN_API;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: MAILGUN_API, domain: MAILGUN_DOMAIN});

function validateContactForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      isFormValid = false;
      errors.name = 'Please provide a name.';
    }

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.message !== 'string' || payload.message.trim().length === 0) {
      isFormValid = false;
      errors.message = 'Please provide a message.';
    }

  if (!isFormValid) {
    message = 'Please check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

exports.postForm = (req, res) => {
  const validationResult = validateContactForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  } else {
    const data = {
      from: 'Green Yoga <postmaster@mg.greenyoga.com.au>',
      to: 'Green Park <namaste@greenyoga.com.au>',
      subject: 'Green Yoga Contact Form',
      text: `[Name: ${req.body.name.trim()}] [Email: ${req.body.email.trim()}] [Message: ${req.body.message.trim()}]`
    };
    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    })
    return res.status(200).json({
      success: true,
      message: 'You have successfully sent the form.'
    })
  };
};
