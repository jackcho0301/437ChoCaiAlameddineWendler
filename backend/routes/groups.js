const express = require('express')

const router = express.Router()

const {getUserGroupMemberships, getGroupMembers, putGroupMembership, allGroups} = require('../controllers/groups')

router.route('/').get(getUserGroupMemberships).post(putGroupMembership)
router.route('/:group').get(getGroupMembers)
router.route('/groups/all').get(allGroups)

module.exports = router
