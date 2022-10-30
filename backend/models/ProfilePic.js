const mongoose = require('mongoose')


const ProfilePicSchema = new mongoose.Schema( {
 
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
    image: {
        data: Buffer, //binary data
        contentType: String
    }
}, {timestamps: true})


module.exports = mongoose.model('ProfilePic', ProfilePicSchema)