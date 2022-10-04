const portfolioData = [
    {
        userID: 1,
        portID: 1,
        stockName: 'TSLA',
        numOfUnits: '100',
        initCost: 312.34
    },
    {
        userID: 1,
        portID: 1,
        stockName: 'AAPL',
        numOfUnits: '150',
        initCost: 163.86
    },
    {
        userID: 1,
        portID: 1,
        stockName: 'MSFT',
        numOfUnits: '125',
        initCost: 284.68
    },
    {
        userID: 1,
        portID: 1,
        stockName: 'NVDA',
        numOfUnits: '200',
        initCost: 218.67
    }
]

const currentData = [
    {
        stockName: 'TSLA',
        currentCost: 240.40
    },
    {
        stockName: 'AAPL',
        currentCost: 142.45
    },
    {
        stockName: 'MSFT',
        currentCost: 240.74
    },
    {
        stockName: 'NVDA',
        currentCost: 125.12
    }
]

module.exports = {portfolioData, currentData}