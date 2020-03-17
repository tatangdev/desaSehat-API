const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    body: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    tag: {
        type: String
    },
    category: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Article', articleSchema)