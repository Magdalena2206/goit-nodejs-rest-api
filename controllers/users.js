const jwt = require('jsonwebtoken');
const Users = require('../dbMethods/users');
const { HttpCode } = require('../configuration/const');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
    const { name, email, password, subscription, gender } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'error',
            code: HttpCode.CONFLICT,
            message: 'Email is already exists',
        });
    }

    try {
        const newUser = await Users.create({
            name,
            email,
            password,
            subscription,
            gender,
        });
        return res.status(HttpCode.CREATED).json({
            status: 'success',
            code: HttpCode.CREATED,
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                subscription: newUser.subscription,
                gender: newUser.gender,
            },
        });
    } catch (error) {
        next(error);
    }
};



const logout = async (req, res, next) => {
    const id = req.user._id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({ test: 'test' });
};
const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user.isValidPassword(password);
    if (!user || !isValidPassword) {
        return res.status(HttpCode.UNAUTHORIZED).json({
            status: 'error',
            code: HttpCode.UNAUTHORIZED,
            message: 'Invalid credentials',
        });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    await Users.updateToken(id, token);
    return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        date: {
            token,
        },
    });
};
const current = async (req, res, next) => {
    const id = req.user._id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({ test: 'test' });
    
};




module.exports = {
    signup,
    login,
    logout,
    current,
};