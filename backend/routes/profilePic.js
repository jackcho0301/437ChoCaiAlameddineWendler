const express = require('express')

const router = express.Router()

const {uploadProfilePic} = require('../controllers/profilePic')

router.route('/').patch(uploadProfilePic)

module.exports = router
