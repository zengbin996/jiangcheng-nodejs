const { Joi, validate } = require('express-validation');
const regexGetter = require('../regexList');

const addUser = validate({
  body: Joi.object({
    username: Joi.string().alphanum().min(5).max(20).required(),
    password: Joi.string().regex(regexGetter('password')).required(),
  }),
});

const AuthSign = validate({
  body: Joi.object({
    username: Joi.string().alphanum().min(5).max(20).required(),
    // password: Joi.string().regex(regexGetter('password')).required(),
    password: Joi.string().required(),
  }),
});

const updatePassword = validate({
  body: Joi.object({
    username: Joi.string().alphanum().min(5).max(20).required(),
    'old-password': Joi.string().regex(regexGetter('password')).required(),
    'new-password': Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required(),
  }),
});

const updateUserinfo = validate({
  body: Joi.object({}),
});

module.exports = {
  addUser,
  AuthSign,
  updatePassword,
  updateUserinfo,
};
