const getAllPortfolios = async (req, res) => {
    
    res.json({
        user: req.user,
        msg: 'get all portfolios'
    })
}

const createPortfolio = async (req, res) => {
    res.json({
        user: req.user,
        msg: 'create portfolio'
    })
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