const { Joi, validate } = require('express-validation');

const postPhotos = validate({
  body: Joi.object({
    files: Joi.array().required(), //文件
    weight: Joi.number().min(0).max(10).default(5), //权重: 0-10
    area: Joi.array(), //地区
    latLon: Joi.string(), //经纬度
    tag: Joi.array(), //标签
    time: Joi.string(), //时间
  }),
});

const patchPhotos = validate({
  body: Joi.object({
    id: Joi.string().required(),
    url: Joi.array(),
    weight: Joi.number().min(0).max(10).default(0), //权重: 0-10, 默认 0
    location: Joi.string(),
    label: Joi.array(), //标签
  }),
});

const deletePhotos = validate({
  body: Joi.object({
    id: Joi.string().required(),
  }),
});

const getPhotos = validate({
  body: Joi.object({
    page: Joi.number().min(1).default(10),
    current: Joi.number().min(0).max(100).default(0),
    weight: Joi.number().min(0).max(10).default(0),
    location: Joi.string(),
    label: Joi.array(),
  }),
});

module.exports = {
  postPhotos,
  patchPhotos,
  deletePhotos,
  getPhotos,
};
