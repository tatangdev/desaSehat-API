const express = require('express');
const router = express.Router();
const user = require('./user.router');
const campaign = require('./campaign.router');
//const review = require('./review.router');

router.use('/user', user);
router.use('/campaign', campaign);
//router.use('/review', review);

module.exports = router;
