const express = require('express')

const router = express.Router()

const {getRankings, getPortfolio, updatePortfolio,sellPortfolioItem, createPortfolio, changePreferredPortfolio, getPreferredPortfolio} = require('../controllers/portfolios')

router.route('/').get(getRankings).post(createPortfolio)
router.route('/:id').get(getPortfolio).delete(sellPortfolioItem).patch(updatePortfolio)
router.route('/choice/portnumber').get(getPreferredPortfolio).post(changePreferredPortfolio)

module.exports = router
