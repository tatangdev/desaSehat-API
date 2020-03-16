const express = require('express')
const router = express.Router()
const address = require('../controllers/address.controller')

router.get('/', address.getProvinces)
router.get('/:id_prov', address.getDistricts)
router.get('/:id_prov/:id_dist', address.gerRegencies)
router.get('/:id_prov/:id_dist/:id_reg', address.getVillages)

module.exports = router
