const express = require('express')

const router = express.Router()

const {getGroupOwnships, createGroup} = require('../controllers/groupownships')

router.route('/').get(getGroupOwnships).post(createGroup)

module.exports = router
