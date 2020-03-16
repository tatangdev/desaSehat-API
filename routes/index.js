const express = require('express');
const router = express.Router();
const user = require('./user.router');
const campaign = require('./campaign.router');
const address = require('./address.router')
//const review = require('./review.router');

router.use('/user', user);
router.use('/campaign', campaign);
router.use('/address', address)
//router.use('/review', review);

module.exports = router;
