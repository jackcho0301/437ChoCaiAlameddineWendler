//Note that this model is for Group OWNSHIP. While it looks
//similar to Group Membership, it has a key difference. This
//table tracks owners of groups, while Group.js only tracks
//membership (all owners are also members).
const mongoose = require('mongoose')

const GroupOwnshipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide owner user ID']
    },
    groupName: {
        type: String,
        required: [true, 'Please provide a group name'],
        minlength: 1,
        maxlength: 20
    },
})

module.exports = mongoose.model('GroupOwnship', GroupOwnshipSchema)
