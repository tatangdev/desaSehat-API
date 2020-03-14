const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.schema')
const Campaign = require('../models/campaign.schema')
const { success, failed, failedMessage } = require('../helpers/response')
const Imagekit = require('imagekit')
const mongoose = require('mongoose')

const imagekitInstance = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}`
})

// create campaign
exports.createCampaign = async (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    
    const { address, title, patient_name, description, total_fund, disease_category, due_date, gender, blood_type, birth_place, date_of_birth } = req.body
    const initiator = user._id

    imagekitInstance
        .upload({
            file: req.file.buffer.toString("base64"),
            fileName: `IMG-CAMPAIGN-${Date()}`
        })
        .then(data => {
            const campaign = new Campaign({
                initiator,
                address,
                title,
                patient_name,
                description,
                total_fund,
                disease_category,
                due_date,
                gender,
                blood_type,
                birth_place,
                date_of_birth,
                image: data.url
            })

            return campaign.save()

        })
        
        .then(result => success(res, 'successfully add a campaign', result, 201))
        .catch(err => failed(res, 'failed to add movie', err, 422))
}

//show all campaign
exports.showAll = (req, res) => {
    Campaign.find()
            .populate({ path: 'initiator', select: '-encrypted_password'})
            .then( data => {
                if (!data) return failedMessage(res, 'campaign not found', 422)
                success(res, 'success', data, 201)
            })
            .catch(err => failed(res, 'failed', err, 422 ))
}

// show a campaign by campaign id
exports.findId = (req, res) => {
    Campaign.findById({ _id: req.params._id})
    .populate({ path: 'initiator', select: '-encrypted_password'})
    .then(result => {
        return success(res, 'success get campaign details', result, 200)
    })
    .catch(err => {
        return res.status(500).json({err:err})
    })
}

// update a campaign by campaign id
exports.updateCampaign = (req, res) => {
    let initiator = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    Campaign.findOneAndUpdate({initiator: initiator._id, _id:req.params.campaign_id }, req.body, { new: true })
            .then( data => {
                if (!data) return failedMessage(res, 'campaign not found', 422)
                success(res, 'successfully update campaign', data, 200)
            })
            .catch(err => failed(res, 'failed update', err, 422))
}

// validate campaign
exports.verifyCampaign = (req, res) => {
    let initiator = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    if (initiator.role === 'user') return failedMessage(
        res, 'You are not authorized to do this action', 403)
    Campaign.findOneAndUpdate({initiator: initiator._id, _id: req.params.campaign_id}, { $set: { verify: req.body.verify}}, { new: true })
            .then( data => {
                if (!data) return failedMessage(res, 'campaign not found', 422)
                success(res, 'successfully validate campaign', data, 200)
            })
            .catch(err => failed(res, 'failed to validate', err, 422))
}

// remove campaign
exports.removeCampaign = (req, res) => {
    let initiator = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
    Campaign.findOneAndDelete({ initiator: initiator._id, _id: req.params.campaign_id})
            .then(data => {
                if (!data) return failedMessage(res, 'campaign not found', 422)
                success(res, `${data.title} has been deleted`, data, 200)
            })
            .catch(err => failed(res, 'failed', err, 422))
}
