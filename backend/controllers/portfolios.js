const getAllPortfolios = async (req, res) => {
    res.send('get all portfolios')
}

const getPortfolio = async (req, res) => {
    res.send('get portfolio')
}

const createPortfolio = async (req, res) => {
    res.send('create portfolio')
}

const updatePortfolio = async (req, res) => {
    res.send('update portfolio')
}

const deletePortfolio = async (req, res) => {
    res.send('delete portfolio')
}

module.exports = { 
    getAllPortfolios, 
    getPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,

}