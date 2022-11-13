//Note that this model is for Group MEMBERSHIP. Group Ownship
//will be handled by a different model.
const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
	ref: 'User',
	required: [true, 'Please provide member user ID']
    },
    groupName: {
        type: String,
        required: [true, 'Please provide a group name'],
	minlength: 1,
	maxlength: 20
    },
})

module.exports = mongoose.model('Group', GroupSchema)
