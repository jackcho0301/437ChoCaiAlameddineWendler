const portfolioData = [
    {
        userID: 1,
        portID: 1,
        stockName: 'TSLA',
        numOfUnits: 100,
        initCost: 312.34
    },
    {
        userID: 1,
        portID: 1,
        stockName: 'AAPL',
        numOfUnits: 150,
        initCost: 163.86
    },
    {
        userID: 1,
        portID: 1,
        stockName: 'MSFT',
        numOfUnits: 125,
        initCost: 284.68
    },
    {
        userID: 1,
        portID: 1,
        stockName: 'NVDA',
        numOfUnits: 200,
        initCost: 218.67
    },
    {
        userID: 2,
        portID: 1,
        stockName: 'TSLA',
        numOfUnits: 200,
        initCost: 300.15
    },
    {
        userID: 2,
        portID: 1,
        stockName: 'F',
        numOfUnits: 50,
        initCost: 12.45
    },
    {
        userID: 2,
        portID: 1,
        stockName: 'MSFT',
        numOfUnits: 150,
        initCost: 250.00
    },
    {
        userID: 2,
        portID: 1,
        stockName: 'TWTR',
        numOfUnits: 75,
        initCost: 60.00
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
    },
    {
        stockName: 'F',
        currentCost: 12.51
    },
    {
        stockName: 'TWTR',
        currentCost: 51.30
    }
]

// This may not perfectly reflect what Jack has made.
// Feel free to edit to make it match the users database.
const usersData = [
    {
        userID: 1,
        userName: 'Stonk_King',
        prefPort: 1
    },
    {
        userID: 2,
        userName: 'Warren Buffett',
        prefPort: 1
    }
]

module.exports = {portfolioData, currentData, usersData}