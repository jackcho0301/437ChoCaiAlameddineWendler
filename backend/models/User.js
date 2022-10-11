const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') 


const UserSchema = new mongoose.Schema( {
    username : {
        type: String,
        required: [true, 'Please provide username'],
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    prefPort: {
        type: Number,
        enum: [1,2,3,4],
        default: 1
    }
}, {timestamps: true})


//mongoose middleware
//before saving the document
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


//instance method:
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}


module.exports = mongoose.model('User', UserSchema)