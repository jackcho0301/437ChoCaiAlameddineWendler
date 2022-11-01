const Group = require('../models/Group')
const User = require('../models/User')
const fetch = require('node-fetch')

// This method will return all groups to which the currently logged-in
// user belongs.
const getUserGroupMemberships = async (req, res) => {
    const userGroupMemInfo = await Group.find({userId:req.user.userId})

    if (userGroupMemInfo.length == 0) {
        return res.status(404).json({success:false,msg:"No group memberships were found. The user may not belong to any."})    
    }
    else {
        let groupNames = []

	for (infoItem of userGroupMemInfo) {
            groupNames.push(infoItem.groupName)
	}

	return res.status(200).json({success:true,data:groupNames})
    }
}

// This method will return all members who belong to a specified group.
// The group name should be passed in as a parameter in the URL.
const getGroupMembers = async (req, res) => {
    const groupTitle = req.params.group
    const groupMemInfo = await Group.find({groupName:groupTitle})

    if (groupMemInfo.length == 0) {
        return res.status(404).json({success:false,msg:"No members were found for the specified group."})
    }
    else {
	let groupNames = []
	for (infoItem of groupMemInfo) {
	    const memberName = await User.find({_id:infoItem.userId})
	    groupNames.push(memberName[0].username)
	}

	return res.status(200).json({success:true,data:groupNames})
    }
}

// This method will insert a new group membership into the group 
// collection. Ideally, at least for this incarnation, it should only
// be called by the owner of the group. However, note that there is
// no such restriction. All that is required for this to work is a
// body.
// {
// 	"name": (The string of the user you wish to make a member
// 	of a group)
// 	"groupTitle": (The string of the group you wish to make 
// 	the "name" a member of)
// }
const putGroupMembership = async (req, res) => {
    const {name,groupTitle} = req.body

    // First get the userId of this name.
    const newMemberInfo = await User.find({username: name})
    // This should only ever return one result.
    if (newMemberInfo.length == 0) {
        return res.status(404).json({success:false, msg:"New member name not found."})
    }
    else {
        const newMemberId = newMemberInfo[0]._id

	// Note that there is no enforcement of group existence here.
	// The new member will be inserted into a new group if it 
	// doesn't exist. Therefore, this should only ever be called
	// by the owner, who can verify the names of their owned groups.
        const membership = new Group({
	    userId: newMemberId,
	    groupName: groupTitle,
	});

	await membership.save();

	return res.status(200).json({success:true, msg:`New member added to ${groupTitle}.`})
    }
}

module.exports = {
    getUserGroupMemberships,
    getGroupMembers,
    putGroupMembership
}
