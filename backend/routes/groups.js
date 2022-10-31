const express = require('express')

const router = express.Router()

const {getUserGroupMemberships, getGroupMembers, putGroupMembership} = require('../controllers/groups')

router.route('/').get(getUserGroupMemberships).post(putGroupMembership)
router.route('/:group').get(getGroupMembers)

module.exports = router
