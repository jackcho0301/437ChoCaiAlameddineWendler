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

const currentDataTwo = [
    {
        stockName: 'TSLA',
        currentCost: 180.00
    },
    {
        stockName: 'AAPL',
        currentCost: 180.00
    },
    {
        stockName: 'MSFT',
        currentCost: 220.00
    },
    {
        stockName: 'NVDA',
        currentCost: 180.00
    },
    {
        stockName: 'F',
        currentCost: 40.00
    },
    {
        stockName: 'TWTR',
        currentCost: 10.00
    },
    {
        stockName: 'AMZN',
        currentCost: 60.00
    },
    {
        stockName: 'GOOGL',
        currentCost: 5.00
    },
    {
        stockName: 'GOOG',
        currentCost: 10.00
    },
    {
        stockName: 'BRK.B',
        currentCost: 80.00
    },
    {
        stockName: 'UNH',
        currentCost: 30.00
    },
    {
        stockName: 'JNJ',
        currentCost: 100.00
    },
    {
        stockName: 'XOM',
        currentCost: 50.00
    },
    {
        stockName: 'JPM',
        currentCost: 120.00
    },
    {
        stockName: 'META',
        currentCost: 70.00
    },
    {
        stockName: 'V',
        currentCost: 140.00
    },
    {
        stockName: 'PG',
        currentCost: 90.00
    },
    {
        stockName: 'HD',
        currentCost: 160.00
    },
    {
        stockName: 'CVX',
        currentCost: 110.00
    },
    {
        stockName: 'LLY',
        currentCost: 190.00
    },
    {
        stockName: 'MA',
        currentCost: 140.00
    },
    {
        stockName: 'ABBV',
        currentCost: 150.00
    },
    {
        stockName: 'PFE',
        currentCost: 220.00
    },
    {
        stockName: 'MRK',
        currentCost: 180.00
    },
    {
        stockName: 'PEP',
        currentCost: 250.00
    },
    {
        stockName: 'BAC',
        currentCost: 200.00
    },
    {
        stockName: 'KO',
        currentCost: 270.00
    },
    {
        stockName: 'dollars',
        currentCost: 1.00
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

module.exports = {portfolioData, currentDataTwo, usersData}