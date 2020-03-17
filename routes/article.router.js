const express = require('express')
const router = express.Router()
const article = require('../controllers/article.controller')
const validate = require('../middlewares/authenticate')

// router.post('/', article.create)
router.get('/', article.getAll)

// article by Id
router.get('/:_id', article.read)
router.put('/:_id', article.update)
router.delete('/:_id', article.delete)

module.exports = router