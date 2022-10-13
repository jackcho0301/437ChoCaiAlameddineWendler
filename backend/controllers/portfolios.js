let {currentData, usersData} = require('./testdata')
const Portfolio = require('../models/Portfolio')
const fetch = require('node-fetch')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');

const createPortfolio = async (req, res) => {
    req.body.userId = req.user.userId;
    console.log(req.body)
    const portfolio  = await Portfolio.create(req.body);
    res.status(StatusCodes.CREATED).json({portfolio});
}

// This is the API for the leaderboard and should be called whenever the
// user inspects the rankings page. Right now, it doesn't expect any sort
// of body--it will always default to return everyone's ranking. Later, 
// we can enhance the body to return filtered results.
const getRankings = async (req, res) => {
    const portfolioInfo = await Portfolio.find();

    let currInfo = []

    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
    currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)

    //REPLACE THE LINE ABOVE WITH THIS CODE WHEN READY
    // // Assemble the list of stock names.
    // let portStockNames = []
    // portInfo.foreach(portItem => portStockNames.push(portItem.stockName))

    // // Create a string for the API call.
    // const portStockString = portStockNames.join()

    // // API Call
    // const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${portStockString}&apikey=<YOURAPIKEY>`)
    // const prices = await twelveDataRes.json()

    // // This assumes that prices are returned in order...need to test.
    // const portStockNamesLength = portStockNames.length
    // for (let i = 0; i < portStockNamesLength; i++){
    //     currItem = {stockName: portStockNames[i], currentPrice: prices[i]}
    //     currInfo.push(currItem)
    // }

    req.ranking = rankingKernel(portfolioInfo, currInfo)
    if (req.ranking){
        res.status(200).json({success:true, data:req.ranking})
    }
    else
    {
        res.status(400).json({success:false, msg:'Error while getting leaderboard'})
    }
}

// This is the API for all portfolio information and should be called when
// the user tries to access their portfolio page. The only parameter necessary
// for this call should be the portfolio ID within the URL.
const getPortfolio = async (req, res) => {
    const portfolioInfo = await Portfolio.find();

    let currInfo = []

    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
    currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)

    //REPLACE THE LINE ABOVE WITH THIS CODE WHEN READY
    // // Assemble the list of stock names.
    // let portStockNames = []
    // portInfo.foreach(portItem => portStockNames.push(portItem.stockName))

    // // Create a string for the API call.
    // const portStockString = portStockNames.join()

    // // API Call
    // const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${portStockString}&apikey=<YOURAPIKEY>`)
    // const prices = await twelveDataRes.json()

    // // This assumes that prices are returned in order...need to test.
    // const portStockNamesLength = portStockNames.length
    // for (let i = 0; i < portStockNamesLength; i++){
    //     currItem = {stockName: portStockNames[i], currentPrice: prices[i]}
    //     currInfo.push(currItem)
    // }

    // const userID = req.params.id
    const portID = req.params.id
    //switch portID to be req.params.id

    const userID = req.user.userId

    if (userID){
        if (portID){
            req.coi = coiKernel(userID,portID,portfolioInfo)
            req.totalReturn = totalReturnKernel(userID,portID,portfolioInfo,currInfo)
            req.stockReturn = stockReturnKernel(userID,portID,portfolioInfo,currInfo)
            req.stockHolding = stockHoldingKernel(userID,portID,portfolioInfo,currInfo)
            req.roi = roiKernel(userID,portID,portfolioInfo,currInfo)
            req.totalValue = totalValueKernel(userID,portID,portfolioInfo,currInfo)
        }
    }

    // Assume if totalValue is there, everything is there.
    if (req.totalValue){
        res.status(200).json({success:true, coi:req.coi, totalReturnVal:req.totalReturn, stockReturns:req.stockReturn, stockHoldings:req.stockHolding,
            roiPercent:req.roi, totalVal:req.totalValue})
    }
    else
    {
        // Either the User ID or Portfolio ID does not exist.
        res.status(404).json({success:false, msg:'User/Portfolio Not Found'})
    }
}

// This is the API for creating/buying stocks, and should primarily be 
// used when creating or buying a portfolio. Note that although this is
// a post request, it returns a value...in particular the total value that
// the user currently has of their portfolio they are either creating or
// buying for. There is a reason for this...this should be used in 
// conjunction with whatever the "Base" amount of money the user gets to
// have when creating a portfolio. Basically subtract this value from 
// "base" and you'll have how much money the user still has to spend.
// When making this POST request, the following JSON input is expected to 
// be passed in the req.body:
// {
//      "stockName": (whatever stock ticker name as a string),
//      "numOfUnits": (how many units they're buying),
//      "initCost": (initial cost of stock per share)
// }
// We can adapt this later to accept whole dollar values and calculate
// numOfUnits from that.
const updatePortfolio = async (req, res) => {
    // const userID = req.params.id
    // const {portID, stockName, numOfUnits, initCost} = req.body
    const portfolioInfo = await Portfolio.find()

    let currInfo = []

    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
    currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)

    //REPLACE THE LINE ABOVE WITH THIS CODE WHEN READY
    // // Assemble the list of stock names.
    // let portStockNames = []
    // portInfo.foreach(portItem => portStockNames.push(portItem.stockName))

    // // Create a string for the API call.
    // const portStockString = portStockNames.join()

    // // API Call
    // const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${portStockString}&apikey=<YOURAPIKEY>`)
    // const prices = await twelveDataRes.json()

    // // This assumes that prices are returned in order...need to test.
    // const portStockNamesLength = portStockNames.length
    // for (let i = 0; i < portStockNamesLength; i++){
    //     currItem = {stockName: portStockNames[i], currentPrice: prices[i]}
    //     currInfo.push(currItem)
    // }

    const userID = req.user.userId
    const portID = req.params.id

    const {stockName, numOfUnits, initCost} = req.body

    if (userID){
        if (portID){
            if (stockName){
                if (numOfUnits){
                    if (initCost){
                        portItem = ({userID:userID, portID:portID, stockName:stockName, numOfUnits:numOfUnits, initCost:initCost})
                        // Note that this method is pushing to the local instance of
                        // the collection of portfolioData. It needs to be adapted to
                        // push to MongoDB instead.
                        await Portfolio.save(portItem);

                        req.totalValue = totalValueKernel(userID,portID,portfolioInfo,currInfo)
                    }
                }
            }
        }
    }

    if (req.totalValue){
        res.status(200).json({success:true, data:req.totalValue})
    }
    else
    {
        res.status(400).json({success:false, msg:'Error while posting new stock purchase'})
    }
}

// This is the API for selling stocks. Note that although this is a 
// delete request, it returns a value...in particular the total value of 
// what they just sold. This should immediately be used to present the
// user with what money they can reinvest. When making this DELETE 
// request, the following JSON input is expected to  be passed in the 
// req.body:
// {
//      "stockName": (whatever stock ticker name as a string)
// }
// We can adapt this later to accept whole dollar values and calculate
// numOfUnits from that.
const sellPortfolioItem = async (req, res) => {
    // const userID = req.params.id
    // const {portID, stockName} = req.body

    const userID = req.user.userId
    const portID = req.params.id
    const {stockName} = req.body

    const portfolioInfo = await Portfolio.find()

    let currInfo = []

    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
    currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)

    //REPLACE THE LINE ABOVE WITH THIS CODE WHEN READY
    // // Assemble the list of stock names.
    // let portStockNames = []
    // portInfo.foreach(portItem => portStockNames.push(portItem.stockName))

    // // Create a string for the API call.
    // const portStockString = portStockNames.join()

    // // API Call
    // const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${portStockString}&apikey=<YOURAPIKEY>`)
    // const prices = await twelveDataRes.json()

    // // This assumes that prices are returned in order...need to test.
    // const portStockNamesLength = portStockNames.length
    // for (let i = 0; i < portStockNamesLength; i++){
    //     currItem = {stockName: portStockNames[i], currentPrice: prices[i]}
    //     currInfo.push(currItem)
    // }

    if (userID){
        if (portID){
            if (stockName){
                // This is off of testData's local instance for now. It needs to be 
                // adapted to search MongoDB instead. This should only ever return
                // one item.
                stockItem = portfolioInfo.filter((portItem) => (portItem.userID==userID && portItem.portID==portID && portItem.stockName===stockName))
                // Get the current price. This will need to come from the hosted
                // stock API. Again, this should only ever return one item.
                const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${stockItem[0].stockName}&apikey=<YOURAPIKEY>`)
                const priceItem = await twelveDataRes.json()
                //currItem = currentData.filter((infoItem) => (infoItem.stockName===stockName))
                // Compute the sale value.
                req.saleValue = (stockItem[0].numOfUnits * Number(priceItem.price))
                // Finally, remove the sold item. This is temporary here, but will
                // be modifying MongoDB in the actual version.
                //portfolioData = portfolioData.filter((portItem) => (portItem.userID!=userID || portItem.portID!=portID || portItem.stockName!==stockName))
                await Portfolio.deleteOne({userId: stockItem[0].userID, portId: stockItem[0].portID, stockName: stockItem[0].stockName})
            }
        }
    }
    
    if (req.saleValue){
        res.status(200).json({success:true, data:req.saleValue})
    }
    else
    {
        res.status(400).json({success:false, msg:'Error while selling stock'})
    }
}

// This method will retrieve the portfolio information for an individual user/
// portfolio combination, represented by integer IDs. It will return a collection
// of items with the properties: "userID", "portID", "stockName", "numOfUnits",
// and "initCost". Each of these items represents a stock purchase in their 
// portfolio. "stockName" is the ticker string of the stock. "numOfUnits" is the 
// number of stocks that they own of that stock. "initCost" represents the price
// they initially paid for that stock.
function retrievePortInfoKernel(userID, portID, portfolioInfo){
    req.body.userId = req.user.userId;
    let portInfo  = portfolioInfo;

    portInfo = portInfo.filter((infoItem) => {
        if ((Number(infoItem.userID) === Number(userID)) & (Number(infoItem.portID) === Number(portID))){
            const {stockName, numOfUnits, initCost} = infoItem
            return {stockName, numOfUnits, initCost}
        }
    })

    return portInfo
}

// NOTE: This method is retained only for reference now.
// This method will retrieve the current info based on an individual user/
// portfolio combination, represented by integer IDs. It does not actually return
// anything from the portfolio directly. Rather, it takes the stockName values
// from the user's portfolio, accesses the same name from the stock API (ideally),
// and returns the current price.
function retrieveCurrInfoKernel(userID, portID, portfolioInfo){
    let currInfo = [...currentData]

    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)

    // // Assemble the list of stock names.
    // let portStockNames = []
    // portInfo.foreach(portItem => portStockNames.push(portItem.stockName))

    // // Create a string for the API call.
    // const portStockString = portStockNames.join()

    // API Call
    //const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${portStockString}&apikey=<YOURAPIKEY>`)
    //const prices = await twelveDataRes.json()

    // This assumes that prices are returned in order...need to test.
    // const portStockNamesLength = portStockNames.length
    // for (let i = 0; i < portStockNamesLength; i++){
    //     currItem = {stockName: portStockNames[i], currentPrice: prices[i]}
    //     currInfo.push(currItem)
    // }

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
function coiKernel(userID, portID, portfolioInfo){
    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)

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
function totalReturnKernel(userID, portID, portfolioInfo, currInfo){
    const coi = coiKernel(userID, portID, portfolioInfo)
    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)

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
function stockReturnKernel(userID, portID, portfolioInfo, currInfo){
    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
    //const currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)

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
function stockHoldingKernel(userID, portID, portfolioInfo, currInfo){
    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)

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
function roiKernel(userID, portID, portfolioInfo, currInfo){
    const totalReturnValue = Number(totalReturnKernel(userID, portID, portfolioInfo, currInfo))
    const coiValue = Number(coiKernel(userID, portID, portfolioInfo))

    // Calculate as a percentage
    roiValue = ((totalReturnValue/coiValue) * 100)

    return roiValue
}

// This method returns the total monetary value of a portfolio, and is
// the primary measure by which we will score users as it should be 
// guaranteed to be non-negative.
function totalValueKernel(userID, portID, portfolioInfo, currInfo){
    const stockReturn = stockReturnKernel(userID, portID, portfolioInfo, currInfo)

    let sumValue = 0
    for (returnItem of stockReturn){
        sumValue += returnItem.return
    }

    return sumValue
}

// This is the main method for calculating the leaderboard without any
// "bells and whistles", although it can be enhanced later for that purpose
// after the MVP. It simply grabs all the users, scores them, and then 
// returns their names and scores pre-sorted in descending order. It should
// be all the front end needs to build the leaderboard.
function rankingKernel(portfolioInfo, currInfo){
    let rankCollection = []

    for (user of usersData)
    {
        totalValueScore = totalValueKernel(user.userID, user.prefPort, portfolioInfo, currInfo)
        rankItem = ({userName:user.userName,score:totalValueScore})
        rankCollection.push(rankItem)
    }

    rankCollection.sort((a,b) => b.score - a.score)

    return rankCollection
}

module.exports = { 
    getRankings, 
    getPortfolio,
    updatePortfolio,
    sellPortfolioItem,
    createPortfolio
}
