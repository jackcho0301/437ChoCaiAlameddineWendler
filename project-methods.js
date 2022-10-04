const {portfolioData, currentData} = require('./testdata')

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

function coiKernel(userID, portID){
    const portInfo = retrievePortInfoKernel(userID, portID)

    let costOfInvestment = 0

    for (pI of portInfo){
        itemProduct = pI.numOfUnits * pI.initCost
        costOfInvestment += itemProduct
    }

    return costOfInvestment
}

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

function roiKernel(userID, portID){
    const totalReturnValue = Number(totalReturnKernel(userID, portID))
    const coiValue = Number(coiKernel(userID, portID))

    // Calculate as a percentage
    roiValue = ((totalReturnValue/coiValue) * 100)

    return roiValue
}

module.exports = {retrievePortInfo, retrieveCurrInfo, coi, totalReturn, stockReturn, stockHolding, roi}