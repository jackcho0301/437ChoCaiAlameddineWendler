const express = require('express')

const router = express.Router()

const {getStats, getTitle, putStat} = require('../controllers/stats')

router.route('/').get(getStats).post(putStat)
router.route('/title').get(getTitle)

module.exports = router
