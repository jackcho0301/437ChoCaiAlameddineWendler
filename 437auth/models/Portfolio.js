const mongoose = require('mongoose')

const PortfolioSchema = new mongoose.Schema( {

    /*
    userID: 1,
    portID: 1,
    stockName: 'TSLA',
    numOfUnits: '100',
    initCost: 312.34
    */

    userID: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
    stockName : {
        type: String,
        required: [true, 'Please provide stock ticker name'],
        minlength: 2,
        maxlength: 10,
        unique: true,
    },
    numOfUnits: {
        type: String,
        required: [true, 'Please provide number of stock units'],
        minlength: 1,
    },
    initCost: {
        type: Number,
        required: [true, 'Please provide initial cost']
    }

})



module.exports = mongoose.model('Portfolio', PortfolioSchema)



