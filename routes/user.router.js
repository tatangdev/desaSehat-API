const express = require('express');
const router = express.Router();
const upload = require('../services/uploader')
const validate = require('../middlewares/authenticate')
const user = require('../controllers/user.controller');

// register
router.post('/', user.userRegister)
// activation
router.get('/activation/:token', user.activation)
// login
router.post('/auth', user.login)
// forgot
router.post('/forgotPassword', user.forgot)
// reset
router.put('/resetPassword/:token', user.reset)
// upload photo
router.put('/updateImage', validate, upload, user.upload)
// update profile
router.put('/', validate, user.editProfile)
// get user profile
router.get('/', validate, user.userProfile)
// get all user
router.get('/allUser', validate, user.getAll)
//delete user
router.delete('/', validate, user.delete)
//change role
router.put('/role/:_id', validate, user.changeRole)
module.exports = router;
