const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema( {
    name : {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        
    }
})


//mongoose middleware
//before saving the document
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


//instance method:
UserSchema.methods.createJWT = function () {
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    //JWT_SECRET: created from allkeysgenerator.com -> 256bit
}

//instance method:
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}


module.exports = mongoose.model('User', UserSchema)