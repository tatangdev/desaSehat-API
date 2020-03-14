const express = require('express')
const router = express.Router()
const upload = require('../services/uploader')
const campaign = require('../controllers/campaign.controller')
const validate = require('../middlewares/authenticate')

// create campaign
router.post('/', validate, upload, campaign.createCampaign)

// show all campaigns
router.get('/', campaign.showAll)

// show campaign details by campaign id
router.get('/:_id', campaign.findId)

// update campaign by campaign id
router.put('/:campaign_id', validate, campaign.updateCampaign)

// validate campaign
router.put('/verify/:campaign_id', validate, campaign.verifyCampaign)

// delete campaign
router.delete('/:campaign_id', validate, campaign.removeCampaign)

module.exports = router;
