const mongoose = require('mongoose');
const Schema = mongoose.Schema
const deseaseCat = require('../helpers/diseaseCategory').getDiseaseCat()

const campaignSchema = new Schema(
  {
    initiator: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    patient_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
    },
    total_fund: {
        type: Number,
        required: true
    },
    current_fund: {
        type: Number,
        required: true,
        default: 0
    },
    verify: {
        type: Boolean,
        default: false
    },
    disease_category: {
        type: String,
        enum: deseaseCat
    },
    due_date: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    blood_type: {
        type: String,
        enum: ['A', 'B', 'AB', 'O'],
        required: true
    },
    birth_place: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    }
  }, 
    {
    versionKey: false,
    timestamps: true
    }
)

module.exports = mongoose.model('Campaign', campaignSchema)
