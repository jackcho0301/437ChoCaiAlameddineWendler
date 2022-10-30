const express = require('express')

const router = express.Router()

const {uploadProfilePic, deleteProfilePic, updateProfilePic, getProfilePic} = require('../controllers/profilePic')

router.route('/').post(uploadProfilePic).delete(deleteProfilePic).put(updateProfilePic).get(getProfilePic)

module.exports = router
