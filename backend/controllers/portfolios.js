const Portfolio = require('../models/Portfolio')
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');
const { json } = require('express');

const getAllPortfolios = async (req, res) => {    
    // res.json({
    //     user: req.user,
    //     msg: 'get all portfolios'
    // })

    const portfolios = await Portfolio.find({userId: req.body.userId = req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({portfolios, count: portfolios.length});
}

const createPortfolio = async (req, res) => {
    // res.json({
    //     user: req.user,
    //     msg: 'create portfolio'
    // })
    req.body.userId = req.user.userId;
    console.log(req.body)
    const portfolio  = await Portfolio.create(req.body);
    res.status(StatusCodes.CREATED).json({portfolio});
}



const getPortfolio = async (req, res) => {
    res.json({
        user: req.user,
        msg: 'get one portfolio',
        portId: req.params.id
    })
}

const updatePortfolio = async (req, res) => {
    res.json({
        user: req.user,
        msg: 'update portfolio',
        portId: req.params.id
    })
}

const deletePortfolio = async (req, res) => {
    res.json({
        user: req.user,
        msg: 'delete portfolio',
        portId: req.params.id
    })
}

module.exports = { 
    getAllPortfolios, 
    getPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,

}