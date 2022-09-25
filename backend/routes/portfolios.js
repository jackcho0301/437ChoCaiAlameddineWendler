const express = require('express')

const router = express.Router()

const {getAllPortfolios, getPortfolio,createPortfolio,updatePortfolio,deletePortfolio,} = require('../controllers/portfolios')

router.route('/').post(createPortfolio).get(getAllPortfolios)
router.route('/:id').get(getPortfolio).delete(deletePortfolio).patch(updatePortfolio)

module.exports = router