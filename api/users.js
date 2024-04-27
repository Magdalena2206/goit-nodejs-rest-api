const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { authorizeUser } = require('../middlewares/auth');
const { uploadMiddleware } = require('../middlewares/upload');

router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.get('/logout', authorizeUser, userController.logout)
router.get('/current', authorizeUser, userController.current)
router.patch('/:userId/subscription', authorizeUser, userController.updateSubscription);
router.patch('/avatars', authorizeUser, uploadMiddleware.single('avatar'), userController.updateAvatar);
router.delete("/",  userController.deleteUserByMail);

module.exports = router