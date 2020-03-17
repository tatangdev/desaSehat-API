const Article = require('../models/article.schema')
const jwt = require('jsonwebtoken')
const {
    success,
    failed
} = require('../helpers/response');

// data cleaner
function clean(obj) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
}

exports.create = (req, res) => {
    let user = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)

    let article = new Article({
        title: req.body.title,
        body: req.body.body,
        owner: user._id,
        tag: req.body.tag,
        category: req.body.category
    })
    clean(article)
    Article.create(article)
        .then(data => {
            success(res, 'Data created', data, 201)
        })
        .catch(err => failed(res, 'Can\'t create data', err, 422))
}

exports.read = (req, res) => {
    Article.findOne({ _id: req.params._id })
        .then(data => {
            if (!data) return failed(res, 'data not found', data, 422)
            success(res, 'data found', data, 200)
        })
        .catch(err => failed(res, 'can\'t find data', err, 422))
}

exports.update = (req, res) => {
    let newData = {
        title: req.body.title,
        body: req.body.body,
        tag: req.body.tag,
        category: req.body.category
    }
    clean(newData)
    Article.findByIdAndUpdate({ _id: req.params._id }, newData)
        .then(data => {
            if (!data) return failed(res, 'data updated', data, 422)
            success(res, 'data found', { ...data._doc, ...newData }, 200)
        })
        .catch(err => failed(res, 'can\'t update data', err, 422))
}

exports.delete = (req, res) => {
    Article.findByIdAndDelete({ _id: req.params._id })
        .then(data => {
            if (!data) return failed(res, 'data not found', data, 422)
            success(res, 'data deleted', data, 200)
        })
        .catch(err => failed(res, 'Can\'t delete data', err, 422))
}

exports.getAll = (req, res) => {
    Article.find()
        .then(data => {
            if (!data) return failed(res, 'data not found', data, 422)
            success(res, 'data found', data, 200)
        })
        .catch(err => failed(res, 'Can\'t find data', err, 422))
}