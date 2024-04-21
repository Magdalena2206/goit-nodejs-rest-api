const { userValidator } = require('./../routes/validator')
const service = require('../models/users')
const jwt = require('jsonwebtoken')
const User = require('../models/schemas/user')
require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY

const signup = async (req, res, next) => {
	const { error } = userValidator(req.body)
	if (error) return res.status(400).json({ message: error.details[0].message })

	const { email, password, subscription } = req.body
	const user = await service.getUser({ email })
	if (user) {
		return res.status(409).json({
			status: 'error',
			code: 409,
			message: 'Email is already exist',
			data: 'Conflict',
		})
	}
	try {
		const newUser = new User({ email, password, subscription })
		newUser.setPassword(password)
		await newUser.save()
		res.status(201).json({
			status: 'success',
			code: 201,
			data: {
				message: 'Registration successful',
			},
		})
	} catch (error) {
		next(error)
	}
}


const logout = async (req, res, next) => {
	try {
		const user = await service.getUser({ _id: req.user._id })
		if (!user) {
			return res.status(401).json({ message: 'Not authorized' })
		} else {
			user.setToken(null)
			await user.save()
			res.json({
				status: 'success',
				code: 204,
				data: {
					message: 'No content',
				},
			})
		}
	} catch (error) {
		next(error)
	}
}
const login = async (req, res, next) => {
	const { error } = userValidator(req.body)
	if (error) return res.status(400).json({ message: error.details[0].message })

	const { email, password } = req.body
	const user = await service.getUser({ email })

	if (!user || !user.validPassword(password)) {
		return res.status(401).json({
			status: 'error',
			code: 401,
			message: 'Email or password is wrong',
			data: 'Unauthorized',
		})
	}

	const payload = {
		id: user.id,
		email: user.email,
	}

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
	user.setToken(token)
	await user.save()
	res.json({
		status: 'success',
		code: 200,
		data: {
			token
		},
	})
}
const current = async (req, res, next) => {
	try {
		const user = await service.getUser({ _id: req.user._id })
		if (!user) {
			return res.status(401).json({ message: 'Not authorized' })
		} else {
			res.json({
				status: 'success',
				code: 200,
				data: {
					user
				},
			})
		}
	} catch (error) {
		next(error)
	}
}

const getUsers = async (req, res, next) => {
	const { email } = req.user
	res.json({
		status: 'success',
		code: 200,
		data: {
			message: `Authorization was successful: ${email}`,
		},
	})
}


module.exports = {
    signup,
    login,
    logout,
    current,
    getUsers
};