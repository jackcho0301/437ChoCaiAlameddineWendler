const mongoose = require('mongoose')

const StatSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
	ref: 'User',
        required: [true, 'Please provide user']
    },
    quarterEnd: {
        type: Date,
        required: [true, 'Please provide a date of end of quarter']
    },
    finalValue: {
	type: Number,
	required: [true, 'Please provide a final score value for quarter']
    },

})

module.exports = mongoose.model('Stat', StatSchema)
