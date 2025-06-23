const Joi = require('joi');

const ListingSchema = Joi.object({
  title: Joi.string().required(),
  image: Joi.object({
    filename: Joi.string(),
    url: Joi.string().allow('', null)
  }),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required()
}).required();

const ReviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5)
  }).required()
}).required();

module.exports = {
  ListingSchema,
  ReviewSchema
};
