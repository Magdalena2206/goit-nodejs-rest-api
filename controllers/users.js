const { userValidator } = require('./../routes/validator')
const service = require('../models/users')
const jwt = require('jsonwebtoken')
const User = require('../models/schemas/user')
require('dotenv').config();
const gravitar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');
const { imageStore } = require('../middlewares/upload');
const { verificationToken } = require('../generateToken');
const nodemailer = require('../utils/sendEmail');

const secret = process.env.SECRET;

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
        const avatarURL = gravitar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm',
		});
		

		const newUser = new User({ email, password, subscription, avatarURL, verificationToken })
		newUser.setPassword(password)
		await newUser.save();
		if (verificationToken) {
			nodemailer.sendMail(email, verificationToken);
		}
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
        next(error);
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

    const token = jwt.sign(payload, secret, { expiresIn: '1h' })
    user.setToken(token)
    await user.save()
    res.json({
        status: 'success',
        code: 200,
        data: {
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        },
    });
};

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

const updateSubscription = async (req, res, next) => {
	try {
		const { error } = userValidator(req.body);
		if (error) return res.status(400).json({ message: error.details[0].message });
		const { subscription } = req.body;
		const { userId } = req.params;

		if (!subscription) {
			res.status(400).json({ message: 'missing field subscription' });
		}
		const user = await service.updateUserSubscription(userId, subscription);

		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({ message: 'Not found' });
		}
	} catch (error) {
		console.error(error.message);
		next(error);
	}
};

const updateAvatar = async (req, res, next) => {
	if (!req.file) {
		return res.status(400).json({ message: 'There is no file' });
	}
	const { description } = req.body;
	const { path: temporaryName } = req.file;
	const fileName = path.join(imageStore, req.file.filename);

	const newUser = await service.updateUserAvatar(req.body.id, fileName);
	try {
		await fs.rename(temporaryName, fileName);
	} catch (err) {
		await fs.unlink(temporaryName);
		return next(err);
	}


	// const retrieveAvatarURL = newUser.getAvatar();
	// console.log(retrieveAvatarURL);


	const isValid = await isCorrectResizedImage(fileName);
	if (!isValid) {
		await fs.unlink(fileName);
		return res.status(400).json({ message: 'File is not a photo or problem during resizing' });
	}

	res.json({
		description,
		fileName,
		avatarURL: newUser.avatarURL,
		message: 'File uploaded correctly',
		status: 200,
	});
};

const isCorrectResizedImage = async imagePath =>
	new Promise(resolve => {
		try {
			Jimp.read(imagePath, (error, image) => {
				if (error) {
					resolve(false);
				} else {
					image.resize(250, 250).write(imagePath);
					resolve(true);
				}
			});
		} catch (error) {
			resolve(false);
		}
	});

const deleteUserByMail = async (req, res) => {
	try {
		const email = req.query.email;
		const userToRemove = await service.deleteUser(email);
		if (!userToRemove) {
			return res.status(404).json({ message: 'Not found user' });
		} else {
			res.status(200).json({ message: 'User deleted from data base' });
		}
	} catch (error) {
		console.log(`Error: ${error.message}`.red);
	}
};

const verifyUserByToken = async (req, res) => {
	try {
		const token = req.params.verificationToken;
		const user = await service.getUser({ verificationToken: token });
		if (!user) {
			return res.status(404).json({ message: 'Not found user' });
		} else {
			await service.updateUserVerification(user.id);
			res.status(200).json({ message: 'Verification successful' });
		}
	} catch (error) {
		console.log(`Error: ${error.message}`.red);
	}
};

const resendMail = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		res.status(400).json({ message: 'missing required field email' });
	}
	const user = await service.getUser({ email });

	if (!user) {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: 'Incorrect email ',
		});
	}
	if (user.validate) {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: 'Verification has already been passed',
		});
	}
	if (!user.validate) {
		nodemailer.sendMail(email, user.verificationToken);
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: 'Verification has already been passed',
		});
	}
};
module.exports = {
    signup,
    login,
    logout,
    current,
    getUsers,
    updateSubscription,
	updateAvatar,
	deleteUserByMail,
	resendMail,
	verifyUserByToken
};