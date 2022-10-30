
const User = require('../models/User')
const ProfilePic = require('../models/ProfilePic')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');
const multer = require('multer')

const fs = require('fs')



//DO NOT USE
// const uploadProfilePic = async (req, res) => {

//     const Storage = multer.diskStorage({
//         destination: 'uploads/' + req.user.username,
//         filename: (req, file, callback) => {
//             callback(null, file.originalname)
//         }
//     })
    
//     const upload = multer({
//         storage: Storage
//     }).single('profilePicture')

//     const userId = req.user.userId
//     const user = await User.findById(userId)

//     upload(req, res, (err) => {
//         if (err) {
//             throw new BadRequestError('Unable to upload image');
//         }
//         else {
            
//             const newImage = new ProfilePic({
//                 userId: userId, 
//                 image: {
//                     data : req.file.filename,
//                     contentType: 'image/png'
//                 }
//             }) 

//             newImage.save()
//                 .then(() =>  res.status(StatusCodes.CREATED).json({msg: "profile picture upload successful"}))
//                 .catch(err => console.log(err))
//         }
//     })
// }



const deleteProfilePic = async (req, res) => {

    const Storage = multer.diskStorage({
        destination: 'uploads/' + req.user.username,
        filename: (req, file, callback) => {
            callback(null, file.originalname)
        }
    })
    
    const upload = multer({
        storage: Storage
    }).single('profilePicture')

    const userId = req.user.userId



    const image =  await ProfilePic.findOneAndDelete({userId: userId});

    if (!image) {   
        throw new BadRequestError('profile picture not found');
    }

    res.status(200).json({msg: "profile picture deleted"});
}


const updateProfilePic = async (req, res) => {

    const Storage = multer.diskStorage({
        destination: 'uploads/' + req.user.username,
        filename: (req, file, callback) => {
            callback(null, file.originalname)
        }
    })
    
    const upload = multer({
        storage: Storage
    }).single('profilePicture')

    const userId = req.user.userId

    const image =  await ProfilePic.findOneAndDelete({userId: userId});
    // if (!image) {   
    //     throw new BadRequestError('profile picture not found');
    // }



    // const dir = '../uploads/' + req.user.username
    // console.log(dir)

    // fs.rmSync(dir, { recursive: true, force: true });


    upload(req, res, (err) => {
        if (err) {
            throw new BadRequestError('Unable to upload image');
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
                .then(() =>  res.status(StatusCodes.CREATED).json({msg: "profile picture UPDATE successful"}))
                .catch(err => console.log(err))
        }
    })

    
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