const mongoose = require('mongoose')

const PriceSchema = new mongoose.Schema( {

    stockName : {
        type: String,
	required: [true, 'Please provide stock ticker name'],
	minlength: 1,
	maxlength: 10,
    },

    currentPrice : {
        type: Number,
	required: [true, 'Please provide current price']
    },
})

module.exports = mongoose.model('Price', PriceSchema)