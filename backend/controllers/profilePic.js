
const User = require('../models/User')
const ProfilePic = require('../models/ProfilePic')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');
const multer = require('multer')

const fs = require('fs')




const updateProfilePic = async (req, res) => {

    const Storage = multer.diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
            // callback(null, file.originalname)
            callback(null, req.user.userId + ".png")
        }
    })
    
    const upload = multer({
        storage: Storage
    }).single('profilePicture')

    const userId = req.user.userId
    const username = req.user.username


    upload(req, res, (err) => {
        if (err) {
            throw new BadRequestError('Unable to upload image');
        }
        else {
            
            res.status(StatusCodes.CREATED).json({msg: "profile picture UPDATE successful"})

            // const newImage = new ProfilePic({
            //     userId: userId, 
            //     image: {
            //         data : req.file.filename,
            //         contentType: 'image/png'
            //     }
            // }) 

            // newImage.save()
            //     .then(() =>  res.status(StatusCodes.CREATED).json({msg: "profile picture UPDATE successful"}))
            //     .catch(err => console.log(err))
        }
    })

    
}


const deleteProfilePic = (req, res) => {

    // const Storage = multer.diskStorage({
    //     destination: 'uploads/',
    //     filename: (req, file, callback) => {
    //         callback(null, req.user.userId + ".png")
    //     }
    // })
    
    // const upload = multer({
    //     storage: Storage
    // }).single('profilePicture')



    // const userId = req.user.userId



    // const image =  await ProfilePic.findOneAndDelete({userId: userId});

    // if (!image) {   
    //     throw new BadRequestError('profile picture not found');
    // }

    res.status(200).json({msg: "profile picture deleted"});
}




const getProfilePic = async (req, res) => {

    const userId = req.user.userId

    const image = await ProfilePic.findOne({userId : userId});

    if (!image) { 
        throw new BadRequestError('Unable to get image');
    }

    res.status(200).json({image: image}); 
}

module.exports = { 
//    uploadProfilePic,
   deleteProfilePic,
   updateProfilePic,
   getProfilePic
}