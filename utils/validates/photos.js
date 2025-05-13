const { Joi, validate } = require('express-validation')

const postPhotos = validate({
  body: Joi.object({
    url: Joi.array().required(),
    weight: Joi.number().min(0).max(10).default(5), //权重: 0-10, 默认 0
    location: Joi.string(), //位置
    label: Joi.array(), //标签
  }),
})

const patchPhotos = validate({
  body: Joi.object({
    id: Joi.string().required(),
    url: Joi.array(),
    weight: Joi.number().min(0).max(10).default(0), //权重: 0-10, 默认 0
    location: Joi.string(),
    label: Joi.array(), //标签
  }),
})

const deletePhotos = validate({
  body: Joi.object({
    id: Joi.string().required(),
  }),
})

const getPhotos = validate({
  body: Joi.object({
    page: Joi.number().min(1).default(10),
    current: Joi.number().min(0).max(100).default(0),
    weight: Joi.number().min(0).max(10).default(0),
    location: Joi.string(),
    label: Joi.array(),
  }),
})

module.exports = {
  postPhotos,
  patchPhotos,
  deletePhotos,
  getPhotos,
}
