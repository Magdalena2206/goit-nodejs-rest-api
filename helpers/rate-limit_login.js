const rateLimit = require('express-rate-limit');
const { HttpCode } = require('../configuration/const');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    handler: (req, res, next) => {
        return res.status(HttpCode.TOO_MANY_REQUESTS).json({
            status: 'error',
            code: HttpCode.TOO_MANY_REQUESTS,
            message: 'Too many login attempts',
        });
    },
});

module.exports = limiter;