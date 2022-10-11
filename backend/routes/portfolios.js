const express = require('express')

const router = express.Router()

const {getRankings, getPortfolio,updatePortfolio,sellPortfolioItem,} = require('../controllers/portfolios')

router.route('/').get(getRankings)
router.route('/:id').get(getPortfolio).delete(sellPortfolioItem).patch(updatePortfolio)

module.exports = router
