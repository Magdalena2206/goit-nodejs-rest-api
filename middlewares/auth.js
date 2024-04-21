const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const User = require('../models/schemas/user')
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY

// const ExtractJWT = passportJWT.ExtractJwt
// const Strategy = passportJWT.Strategy
const params = {
	secretOrKey: SECRET_KEY,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

// JWT Strategy
passport.use(
	new Strategy(params, function (payload, done) {
		User.find({ _id: payload.id })
			.then(([user]) => {
				if (!user) {
					return done(new Error('User not found'))
				}
				return done(null, user)
			})
			.catch(err => done(err))
	})
)


const auth = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (!user || err) {
			return res.status(401).json({
				status: 'error',
				code: 401,
				message: 'Unauthorized',
				data: 'Unauthorized',
			})
		}
		req.user = user
		next()
	})(req, res, next)
}

module.exports = { auth }