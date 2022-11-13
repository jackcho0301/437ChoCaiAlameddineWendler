const GroupOwnship = require('../models/GroupOwnship')
const Group = require('../models/Group')
const User = require('../models/User')
const fetch = require('node-fetch')

// This method will return all groups that the currently logged-in
// user currently owns (i.e. created).
const getGroupOwnships = async (req, res) => {
    const groupOwnInfo = await GroupOwnship.find({userId:req.user.userId})

    if (groupOwnInfo.length == 0) {
        return res.status(200).json({success:false,msg:"You have not created any groups."})
    }
    else {
	let ownedGroups = []

	for (infoItem of groupOwnInfo) {
	    ownedGroups.push(infoItem.groupName)
	}

	return res.status(200).json({success:true,data:ownedGroups})
    }
}

// This method will allow a user to declare themselves the owner of 
// a new group by inserting a new entry into the GroupOwnship table.
// It is followed directly after by declaring themselves the sole 
// member of a brand new group in the Group table; in effect creating
// the group. Note that the method for adding additional members to
// this group is actually located in groups.js.
// The body of this method is simply the name of the new group, 
// which must be unique.
// {
// 	"groupTitle": (String of the new group. Limited to 20 chars
// 	and must be unique)
// }
const createGroup = async (req, res) => {
    const {groupTitle} = req.body

    // First verify that no group already exists with this name.
    const existingGroup = await Group.find({groupName:groupTitle})

    // If nothing was returned, the group doesn't exist.
    if (existingGroup.length == 0) {
        // First create the new GroupOwnship entry.
	const ownship = new GroupOwnship({
	    userId: req.user.userId,
	    groupName: groupTitle,
	});
	
	await ownship.save();
	
	// Now create the Group entry.
	const membership = new Group({
	    userId: req.user.userId,
	    groupName: groupTitle,
	});

	await membership.save();

	return res.status(200).json({success:true,msg:"New group created."})
    }
    else {
	return res.status(200).json({success:false,msg:"The group name specified already exists."})
    }
}

module.exports = {
    getGroupOwnships,
    createGroup
}
