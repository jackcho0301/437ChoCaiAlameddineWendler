let {currentData} = require('./testdata')
const Portfolio = require('../models/Portfolio')
const User = require('../models/User')
const fetch = require('node-fetch')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors');
const NodeCache = require('node-cache');

const currentCache = new NodeCache({stdTTL:100,checkperiod:86400});

// Upon calling this API, a new entry will be inserted in portfolios
// for a special stock called "dollars" along with the default
// startingMoney amount.
const createPortfolio = async (req, res) => {
    const startingMoney = 10000
    const userID = req.user.userId;
    let portID = 1

    // First verify that the user has not already created max portfolios
    const portfolioInfo = await Portfolio.find()
    let portInfo;
    let portfolio;
    while (portID <= 4) {
        portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
        if (portInfo.length > 0) {
            // TEST CODE - Check for the presence of a "dollars" portfolio.
            // This is being used only to correct past MongoDB entries
            const dollarsItem = portInfo.filter((item) => item.stockName === "dollars")
            if (dollarsItem.length == 0){
                // Make a new portfolio entry for "dollars".
                portItem = ({userId:userID, portId:portID, stockName:"dollars", numOfUnits:startingMoney, initCost:1})
                portfolio = await Portfolio.create(portItem);
                res.status(StatusCodes.CREATED).json({portfolio});
		break;
            }
        }
        else
        {
            // Make a new portfolio entry for "dollars".
            portItem = ({userId:userID, portId:portID, stockName:"dollars", numOfUnits:startingMoney, initCost:1})
            portfolio = await Portfolio.create(portItem);
            res.status(StatusCodes.CREATED).json({portfolio});
	    break;
        }
	portID += 1
    }
    
    if (portID <= 4){
	res.status(StatusCodes.CREATED).json({portfolio});
    }
    else {
	res.status(400).json({msg: "You are already at the maximum number of portfolios."});
    }
}

// This is the API for the leaderboard and should be called whenever the
// user inspects the rankings page. Right now, it doesn't expect any sort
// of body--it will always default to return everyone's ranking. Later, 
// we can enhance the body to return filtered results.
const getRankings = async (req, res) => {
    const portfolioInfo = await Portfolio.find();
    const userInfo = await User.find();

    let rankCollection = []

    for (var i = 0; i < userInfo.length; i++)
    {
        let currInfo = []

        let portInfo = retrievePortInfoKernel(userInfo[i]._id, 1, portfolioInfo)
        currInfo = retrieveCurrInfoKernel(userInfo[i]._id, 1, portfolioInfo)

        // REPLACE THE LINE ABOVE WITH THIS CODE WHEN READY
        // Assemble the list of stock names.
        //let portStockNames = []
        //for (portItem of portInfo){
        //	portStockNames.push(portItem.stockName)
        //}
                         
        //// Remove the dollars.
        //portStockNames = portStockNames.filter(function(name) {
        //	return name !== 'dollars';
        //});

        //currInfo.push({stockName:"dollars", currentCost:1})

        //for (name of portStockNames){
        //	if (currentCache.has(name)){
        //	    foundItem = currInfo.filter(function(item) {
        //		return item.stockName === name;
        //	    });
        //	    if (foundItem.length == 0){
        //            currInfo.push(currentCache.get(name))
        //	    }
        //    }
        //    else{
        //	    const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${name}&apikey=<YOURAPIKEY>`)
        //	    const APIData = await twelveDataRes.json()
        //	    currentCache.set(name, {stockName:name, currentCost:(Number(APIData.price))})
        //	    foundItem = currInfo.filter(function(item) {
        //            return item.stockName === name;
        //	    });
        // 	    if (foundItem.length == 0){
        //	        currInfo.push({stockName:name, currentCost:(Number(APIData.price))})
        //	    }
        //    }
        //}

        totalValueScore = totalValueKernel(userInfo[i]._id, 1, portfolioInfo, currInfo)
        rankItem = ({userName:userInfo[i].username,score:totalValueScore})
        rankCollection.push(rankItem)
    }
    
    if (rankCollection){
        rankCollection.sort((a,b) => b.score - a.score)
        res.status(200).json({success:true, data:rankCollection})
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

    // const userID = req.params.id
    const portID = req.params.id
    //switch portID to be req.params.id

    const userID = req.user.userId

    let currInfo = []

    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
    currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)

    // REPLACE THE LINE ABOVE WITH THIS CODE WHEN READY
    // Assemble the list of stock names.
    //let portStockNames = []
    //for (portItem of portInfo){
    //	portStockNames.push(portItem.stockName)
    //}
                         
    //// Remove the dollars.
    //portStockNames = portStockNames.filter(function(name) {
    //	return name !== 'dollars';
    //});

    //currInfo.push({stockName:"dollars", currentCost:1})

    //for (name of portStockNames){
    //	if (currentCache.has(name)){
    //	    foundItem = currInfo.filter(function(item) {
    //		return item.stockName === name;
    //	    });
    //	    if (foundItem.length == 0){
    //            currInfo.push(currentCache.get(name))
    //	    }
    //    }
    //    else{
    //	    const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${name}&apikey=<YOURAPIKEY>`)
    //	    const APIData = await twelveDataRes.json()
    //	    currentCache.set(name, {stockName:name, currentCost:(Number(APIData.price))})
    //	    foundItem = currInfo.filter(function(item) {
    //            return item.stockName === name;
    //	    });
    // 	    if (foundItem.length == 0){
    //	        currInfo.push({stockName:name, currentCost:(Number(APIData.price))})
    //	    }
    //    }
    //}

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
    let stockDoesntExist = false
    let insufficientFunds = false
    let invalidPurchaseAmount = false
    let portfolioInfo = await Portfolio.find()

    const userID = req.user.userId
    const portID = req.params.id

    let currInfo = []

    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
    currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)
    
    // REPLACE THE LINE ABOVE WITH THIS CODE WHEN READY
    // Assemble the list of stock names.
    //let portStockNames = []
    //for (portItem of portInfo){
    //	portStockNames.push(portItem.stockName)
    //}
                         
    //// Remove the dollars.
    //portStockNames = portStockNames.filter(function(name) {
    //	return name !== 'dollars';
    //});

    //currInfo.push({stockName:"dollars", currentCost:1})

    //for (name of portStockNames){
    //	if (currentCache.has(name)){
    //	    foundItem = currInfo.filter(function(item) {
    //		return item.stockName === name;
    //	    });
    //	    if (foundItem.length == 0){
    //            currInfo.push(currentCache.get(name))
    //	    }
    //    }
    //    else{
    //	    const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${name}&apikey=<YOURAPIKEY>`)
    //	    const APIData = await twelveDataRes.json()
    //	    currentCache.set(name, {stockName:name, currentCost:(Number(APIData.price))})
    //	    foundItem = currInfo.filter(function(item) {
    //            return item.stockName === name;
    //	    });
    // 	    if (foundItem.length == 0){
    //	        currInfo.push({stockName:name, currentCost:(Number(APIData.price))})
    //	    }
    //    }
    //}

    const {stockName, numOfUnits, initCost} = req.body

    if (userID){
        if (portID){
            if (stockName){
                if (numOfUnits){
                    // Assume the user wants to purchase shares directly at the current price.
                    // First see if this stock exists. Note this will have to be checked against
                    // the TwelveData API or cache later.
                    currItem = currentData.filter((infoItem) => (infoItem.stockName===stockName))
                    if (currItem.length == 0){
                        stockDoesntExist = true
                    }
                    else {
                        // Finally, before allowing the purchase to go through, verify the user
                        // has the funds for it...
                        currentFunds = await Portfolio.find({userId:userID, portId:portID, stockName:"dollars"})
                        // This should always return something.
                        let afterPurchaseFunds = currentFunds[0].numOfUnits - (numOfUnits * currItem[0].currentCost)
                        // If the answer is negative...
                        if (afterPurchaseFunds < 0){
                            // Cancel the sale...user cannot "buy naked" at this time.
                            insufficientFunds = true
                        }
                        else {
                            // Do we create a new item or add to an existing one? Searcg for an existing item first.
                            searchItem = await Portfolio.find({userId:userID, portId:portID, stockName:stockName, initCost:currItem[0].currentCost})
                            if (searchItem.length > 0) {
                                // Just add to the existing item.
                                newNumOfUnits = numOfUnits + searchItem[0].numOfUnits
                                await Portfolio.findOneAndUpdate({userId:userID, portId:portID, stockName:stockName, initCost:currItem[0].currentCost}, {numOfUnits:newNumOfUnits})
                            }
                            else {
                                // Make a brand new entry.
                                portItem = ({userId:userID, portId:portID, stockName:stockName, numOfUnits:numOfUnits, initCost:currItem[0].currentCost})
                                await Portfolio.create(portItem);
                            }
                            // Update the money
                            await Portfolio.findOneAndUpdate({userId:userID, portId:portID, stockName:"dollars"}, {numOfUnits:afterPurchaseFunds})
                            // portfolioInfo and currInfo are now stale...reload here.
                            portfolioInfo = await Portfolio.find()
                            currInfo = retrieveCurrInfoKernel(userID,portID,portfolioInfo)
                            req.totalValue = totalValueKernel(userID,portID,portfolioInfo,currInfo)
                        }
                    }
                }
                else {
                    // Assume that an initCost for a flat stock rate was submitted.
                    // First see if this stock exists. Note this will have to be checked
                    // against the TwelveData API or cache later.
                    currItem = currentData.filter((infoItem) => (infoItem.stockName===stockName))
                    if (currItem.length == 0){
                        stockDoesntExist = true
                    }
                    else {
                        // Finally, before allowing the purchase to go through, verify
                        // the user has the funds for it...
                        currentFunds = await Portfolio.find({userId:userID, portId:portID, stockName:"dollars"})
                        // This should always return something.
                        let afterPurchaseFunds = currentFunds[0].numOfUnits - initCost
                        // If the answer is negative...
                        if (afterPurchaseFunds < 0){
                            // Cancel the sale.
                            insufficientFunds = true
                        }
                        else {
                            // Calculate the number of units. Note we should convert to float just in case.
                            calcNumOfUnits = ((initCost*1.0) / currItem[0].currentCost)
                            if (calcNumOfUnits == 0){
                                invalidPurchaseAmount = true
                            }
                            else {
                                // Do we create a new item or add to an existing one? Search for an existing item first.
                                searchItem = await Portfolio.find({userId:userID, portId:portID, stockName:stockName, initCost:currItem[0].currentCost})
                                if (searchItem.length > 0) {
                                    // Just add to the existing item.
                                    newNumOfUnits = calcNumOfUnits + searchItem[0].numOfUnits
                                    await Portfolio.findOneAndUpdate({userId:userID, portId:portID, stockName:stockName, initCost:currItem[0].currentCost}, {numOfUnits:newNumOfUnits})
                                }
                                else {
                                    // Make a brand new entry.
                                    portItem = ({userId:userID, portId:portID, stockName:stockName, numOfUnits:calcNumOfUnits, initCost:currItem[0].currentCost})
                                    await Portfolio.create(portItem);
                                }

                                // Update the money
                                await Portfolio.findOneAndUpdate({userId:userID, portId:portID, stockName:"dollars"}, {numOfUnits:afterPurchaseFunds})
                                // portfolioInfo and currInfo is now stale...reload here.
                                portfolioInfo = await Portfolio.find()
                                currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)
                                req.totalValue = totalValueKernel(userID,portID,portfolioInfo,currInfo)
                            }
                        }
                    }
                }
            }
        }
    }

    if (req.totalValue){
        res.status(200).json({data: {success:true, retdata:req.totalValue}})
    }
    else if (stockDoesntExist){
        res.status(400).json({success:false, msg:'The requested stock does not exist.'})
    }
    else if (insufficientFunds){
        res.status(400).json({success:false, msg:'You don\'t have enough funds for this purchase.'})
    }
    else if (invalidPurchaseAmount){
	res.status(400).json({success:false, msg:'You did not specify a stock number or flat purchase.'})
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
    let saleValue = 0
    let totalSaleValue = 0

    const portInfo = retrievePortInfoKernel(userID, portID, portfolioInfo)
    currInfo = retrieveCurrInfoKernel(userID, portID, portfolioInfo)

    // REPLACE THE LINE ABOVE WITH THIS CODE WHEN READY
    // Assemble the list of stock names.
    //let portStockNames = []
    //for (portItem of portInfo){
    //	portStockNames.push(portItem.stockName)
    //}
                         
    //// Remove the dollars.
    //portStockNames = portStockNames.filter(function(name) {
    //	return name !== 'dollars';
    //});

    //currInfo.push({stockName:"dollars", currentCost:1})

    //for (name of portStockNames){
    //	if (currentCache.has(name)){
    //	    foundItem = currInfo.filter(function(item) {
    //		return item.stockName === name;
    //	    });
    //	    if (foundItem.length == 0){
    //            currInfo.push(currentCache.get(name))
    //	    }
    //    }
    //    else{
    //	    const twelveDataRes = await fetch(`https://api.twelvedata.com/price?symbol=${name}&apikey=<YOURAPIKEY>`)
    //	    const APIData = await twelveDataRes.json()
    //	    currentCache.set(name, {stockName:name, currentCost:(Number(APIData.price))})
    //	    foundItem = currInfo.filter(function(item) {
    //            return item.stockName === name;
    //	    });
    // 	    if (foundItem.length == 0){
    //	        currInfo.push({stockName:name, currentCost:(Number(APIData.price))})
    //	    }
    //    }
    //}
    
    if (userID){
        if (portID){
            if (stockName){
                // This may return multiple items, so be careful.
                stockItem = portfolioInfo.filter((portItem) => (String(portItem.userId)===String(userID) && Number(portItem.portId)==Number(portID) && String(portItem.stockName)===String(stockName)))
                // If we return nothing, the item doesn't exist so don't try and sell.
                if (stockItem.length > 0){
                    // Get the current price.
                    currItem = currInfo.filter((infoItem) => (infoItem.stockName===stockName))
                    // Compute the sale value of all entries.
	                for (let i = 0; i < stockItem.length; i++) {
                        saleValue = (stockItem[i].numOfUnits * Number(currItem[0].currentCost))
                        // Add this money to the user's dollars value.
                        currentFunds = await Portfolio.find({userId: stockItem[i].userId, portId: stockItem[i].portId, stockName: "dollars"});
                        let newAvailableFunds = currentFunds[0].numOfUnits + saleValue
                        await Portfolio.findOneAndUpdate({userId: stockItem[0].userId, portId: stockItem[0].portId, stockName: "dollars"}, {numOfUnits: newAvailableFunds})
                        // Finally, remove the sold item.
                        await Portfolio.deleteOne({_id: stockItem[i]._id})
			            totalSaleValue += saleValue
		            }
                }
            }
        }
    }
    
    if (saleValue){
        res.status(200).json({success:true, data:totalSaleValue})
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
    let portInfo  = portfolioInfo;

    portInfo = portInfo.filter((infoItem) => {
        if ((String(infoItem.userId) === String(userID)) & (Number(infoItem.portId) == Number(portID))){
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
        currentItem = currentData.filter((infoItem) => {
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

// NOTE: This is only being retained for reference.
// This is the main method for calculating the leaderboard without any
// "bells and whistles", although it can be enhanced later for that purpose
// after the MVP. It simply grabs all the users, scores them, and then 
// returns their names and scores pre-sorted in descending order. It should
// be all the front end needs to build the leaderboard.
function rankingKernel(portfolioInfo, currInfo, userInfo){
    let rankCollection = []
    console.log(userInfo)

    for (user of userInfo)
    {
        console.log(user)
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