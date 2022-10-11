//import model
const User = require('../models/User')

const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    res.status(StatusCodes.CREATED).json({msg: "register successful", username: user.username})
}


const login =  async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        throw new BadRequestError('Please provide username and password');
    }
    const user = await User.findOne({username});
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    //compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError ("invalid credentials");
    }

    //save user id to req.session
    //will be passed down to authentication middleware
    req.session.userId = user.id

    res.status(StatusCodes.OK).json({msg: "login successful", username: user.username});


}


const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            throw err
        }
        res.clearCookie(process.env.SESSION_NAME)
        res.status(StatusCodes.OK).json({msg: "successful logout"});

    })
}



module.exports = { 
    register, 
    login,
    logout,
}