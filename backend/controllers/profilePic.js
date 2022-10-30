
const User = require('../models/User')
const ProfilePic = require('../models/ProfilePic')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');
const multer = require('multer')

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
        callback(null,  file.originalname)
    }
})

const upload = multer({
    storage: Storage
}).single('profilePicture')


const uploadProfilePic = async (req, res) => {

    const userId = req.user.userId
    const user = await User.findById(userId)

    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            
            const newImage = new ProfilePic({
                userId: userId, 
                image: {
                    data : req.file.filename,
                    contentType: 'image/png'
                }
            }) 

            newImage.save()
                .then(() =>  res.status(StatusCodes.CREATED).json({msg: "profile picture upload successful", username: user.username}))
                .catch(err => console.log(err))

        }
    })
}


module.exports = { 
   uploadProfilePic
}