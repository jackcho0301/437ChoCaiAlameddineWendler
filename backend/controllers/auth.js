//import model
const User = require('../models/User')
const Portfolio = require('../models/Portfolio')

const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');

const startingMoney = 10000

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    // Create the four portfolios
    let portItem = ({userId:user._id, portId:1, stockName:"dollars", numOfUnits:startingMoney, initCost:1})
    await Portfolio.create(portItem);
    portItem = ({userId:user._id, portId:2, stockName:"dollars", numOfUnits:startingMoney, initCost:1})
    await Portfolio.create(portItem);
    portItem = ({userId:user._id, portId:3, stockName:"dollars", numOfUnits:startingMoney, initCost:1})
    await Portfolio.create(portItem);
    portItem = ({userId:user._id, portId:4, stockName:"dollars", numOfUnits:startingMoney, initCost:1})
    await Portfolio.create(portItem);
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
