const Joi = require('joi');

const schemaContact = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    phone: Joi.number().integer().required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
        .required(),
});



const pattern = /[a-zA-Z0-9_-]/;

const schemaId = Joi.object({
    id: Joi.string().pattern(new RegExp(pattern)).required(),
});

const schemaStatusContact = Joi.object({
    favorite: Joi.boolean().required(),
});
  
const validate = async (schema, obj, res, next) => {
    try {
        await schema.validateAsync(obj);
        next();
    } catch (err) {
        return res.status(400).json({
            status: 'error',
            code: 400,
            message: `Field ${err.message.replace(/"/g, '')}`,
        });
    }
};

module.exports.validateContact = async (req, res, next) => {
    return await validate(schemaContact, req.body, res, next);
};

module.exports.validateId = async (req, res, next) => {
    return await validate(schemaId, req.params, res, next);
};
module.exports.validateStatusContact = async (req, res, next) => {
    return await validate(schemaStatusContact, req.body, res, next);
  };