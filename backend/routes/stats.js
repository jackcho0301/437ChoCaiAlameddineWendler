const express = require('express')

const router = express.Router()

const {getStats, putStat} = require('../controllers/stats')

router.route('/').get(getStats).post(putStat)

module.exports = router
