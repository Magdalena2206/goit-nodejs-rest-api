const mongoose = require('mongoose')
const { Schema } = mongoose
const bCrypt = require('bcryptjs')

const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, 'Password is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},
		token: {
			type: String,
			default: null,
        },
        avatarURL: {
			type: String,
			default: null,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
		verify: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
			default: null,
			required: [true, 'Verify token is required'],
		},
	},
	{ versionKey: false, timestamp: true }
)

userSchema.methods.setPassword = function (password) {
	if (password) {
	  console.log("Received password:", password);
	  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
	} else {
	  console.error("Password is undefined");
	}
  }

userSchema.methods.validPassword = function (password) {
	return bCrypt.compareSync(password, this.password)
}

userSchema.methods.setToken = function (token) {
	this.token = token
}

userSchema.methods.setAvatar = function (avatarURL) {
	this.avatar = avatarURL
}

const User = mongoose.model('User', userSchema, 'users')

module.exports = User

