const express = require('express')

const router = express.Router()

const {getRankings, getPortfolio,updatePortfolio,sellPortfolioItem, createPortfolio} = require('../controllers/portfolios')

router.route('/').get(getRankings).post(createPortfolio)
router.route('/:id').get(getPortfolio).delete(sellPortfolioItem).patch(updatePortfolio)

module.exports = router
