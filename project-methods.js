const {portfolioData, currentData} = require('./testdata')

// Each of these methods are middleware and act as wrappers for the
// "kernel" functions below, where the actual meat of the operations
// take place.
const retrievePortInfo = (req, res, next) => {
    const {userID, portID} = req.query

    if (userID & portID){
        req.retPortInfo = retrievePortInfoKernel(userID, portID)
        next()
    }
    else
    {
        res.status(200).send('User and Portfolio do not exist')
    }
};

const retrieveCurrInfo = (req, res, next) => {
    const {userID, portID} = req.query

    if (userID & portID){
        req.retCurrInfo = retrieveCurrInfoKernel(userID, portID)
        next()
    }
    else
    {
        res.status(200).send('User and Portfolio do not exist')
    }
};

const coi = (req, res, next) => {
    const {userID, portID} = req.query

    if (userID & portID){
        req.coi = coiKernel(userID,portID)
        next()
    }
    else
    {
        res.status(200).send('User and Portfolio do not exist')
    }
}

const totalReturn = (req, res, next) => {
    const {userID, portID} = req.query

    if (userID & portID){
        req.totalReturn = totalReturnKernel(userID,portID)
        next()
    }
    else
    {
        res.status(200).send('User and Portfolio do not exist')
    }
}

const stockReturn = (req, res, next) => {
    const {userID, portID} = req.query

    if (userID & portID){
        req.stockReturn = stockReturnKernel(userID,portID)
        next()
    }
    else
    {
        res.status(200).send('User and Portfolio do not exist')
    }
}

const stockHolding = (req, res, next) => {
    const {userID, portID} = req.query

    if (userID & portID){
        req.stockHolding = stockHoldingKernel(userID,portID)
        next()
    }
    else
    {
        res.status(200).send('User and Portfolio do not exist')
    }
}

const roi = (req, res, next) => {
    const {userID, portID} = req.query

    if (userID & portID){
        req.roi = roiKernel(userID,portID)
        next()
    }
    else
    {
        res.status(200).send('User and Portfolio do not exist')
    }
}

// This method will retrieve the portfolio information for an individual user/
// portfolio combination, represented by integer IDs. It will return a collection
// of items with the properties: "userID", "portID", "stockName", "numOfUnits",
// and "initCost". Each of these items represents a stock purchase in their 
// portfolio. "stockName" is the ticker string of the stock. "numOfUnits" is the 
// number of stocks that they own of that stock. "initCost" represents the price
// they initially paid for that stock.
function retrievePortInfoKernel(userID, portID){
    let portInfo = [...portfolioData]

    portInfo = portInfo.filter((infoItem) => {
        if ((Number(infoItem.userID) === Number(userID)) & (Number(infoItem.portID) === Number(portID))){
            const {stockName, numOfUnits, initCost} = infoItem
            return {stockName, numOfUnits, initCost}
        }
    })

    return portInfo
}

// This method will retrieve the current info based on an individual user/
// portfolio combination, represented by integer IDs. It does not actually return
// anything from the portfolio directly. Rather, it takes the stockName values
// from the user's portfolio, accesses the same name from the stock API (ideally),
// and returns the current price.
function retrieveCurrInfoKernel(userID, portID){
    let currInfo = [...currentData]

    const portInfo = retrievePortInfoKernel(userID, portID)

    currInfo = currInfo.filter((infoItem) => {
        for (pI of portInfo){
            if (pI.stockName === infoItem.stockName){
                return infoItem
            }
        }
    })

    return currInfo
}

// This method will return the overall initial initial cost of investment
// of their purchases. Ideally, if we are giving everyone the same 
// starting amount of money, this will always be the same value.
function coiKernel(userID, portID){
    const portInfo = retrievePortInfoKernel(userID, portID)

    let costOfInvestment = 0

    for (pI of portInfo){
        itemProduct = pI.numOfUnits * pI.initCost
        costOfInvestment += itemProduct
    }

    return costOfInvestment
}

// This method will return the total return value for an individual 
// user's portfolio; i.e. how much money they have gained or lost
// on this portfolio. Keep in mind this value can be negative if 
// too many stocks lost value.
function totalReturnKernel(userID, portID){
    const coi = coiKernel(userID, portID)
    const portInfo = retrievePortInfoKernel(userID, portID)
    const currInfo = retrieveCurrInfoKernel(userID, portID)

    // Set the initial value.
    let initialValue = coi

    // Get the current value.
    let currentValue = 0
    for (pI of portInfo){
        // Should only ever return one item
        currentItem = currInfo.filter((infoItem) => {
            if (pI.stockName === infoItem.stockName){
                return infoItem
            }
        })

        currentValue += (pI.numOfUnits * currentItem[0].currentCost)
    }

    // Calculate the total return.
    totReturn = currentValue - initialValue
    return totReturn
}

// This method will return the individual value of each stock the
// user currently owns in a particular portfolio. It is designed to
// be used with generating that pie chart on that one window.
function stockReturnKernel(userID, portID){
    const portInfo = retrievePortInfoKernel(userID, portID)
    const currInfo = retrieveCurrInfoKernel(userID, portID)

    let returnCollection = []
    for (pI of portInfo){
        // Should only ever return one item
        currentItem = currInfo.filter((infoItem) => {
            if (pI.stockName === infoItem.stockName){
                return infoItem
            }
        })

        indivReturn = (pI.numOfUnits * currentItem[0].currentCost)
        returnItem = ({stockName:pI.stockName,return:indivReturn})
        returnCollection.push(returnItem)
    }

    return returnCollection
}

// This method will return the individual holding of each stock the
// user currently owns in a particular portfolio. It is designed to 
// be used with generating that pie chart on that one window.
function stockHoldingKernel(userID, portID){
    const portInfo = retrievePortInfoKernel(userID, portID)
    const currInfo = retrieveCurrInfoKernel(userID, portID)

    // Get the current value.
    let currentValue = 0
    for (pI of portInfo){
        // Should only ever return one item
        currentItem = currInfo.filter((infoItem) => {
            if (pI.stockName === infoItem.stockName){
                return infoItem
            }
        })

        currentValue += (pI.numOfUnits * currentItem[0].currentCost)
    }

    let holdingCollection = []
    for (pI of portInfo){
        // Should only ever return one item
        currentItem = currInfo.filter((infoItem) => {
            if (pI.stockName === infoItem.stockName){
                return infoItem
            }
        })

        indivReturn = (pI.numOfUnits * currentItem[0].currentCost)
        indivHolding = ((indivReturn / currentValue) * 100)
        holdingItem = ({stockName:pI.stockName,holding:indivHolding})
        holdingCollection.push(holdingItem)
    }

    return holdingCollection
}

// This method returns the overall ROI for a given user's portfolio as
// a percentage.
function roiKernel(userID, portID){
    const totalReturnValue = Number(totalReturnKernel(userID, portID))
    const coiValue = Number(coiKernel(userID, portID))

    // Calculate as a percentage
    roiValue = ((totalReturnValue/coiValue) * 100)

    return roiValue
}

module.exports = {retrievePortInfo, retrieveCurrInfo, coi, totalReturn, stockReturn, stockHolding, roi}
