const express = require('express');
const app = express();

const {ranking, allUserPortInfo, postPortfolioEntry, sellPortfolioEntry} = require('./project-methods')

// Parse JSON
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Home Page for Method Testing')
})

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
//      "userID": (whatever user ID),
//      "portID": (whatever portfolio ID),
//      "stockName": (whatever stock ticker name as a string),
//      "numOfUnits": (how many units they're buying),
//      "initCost": (initial cost of stock per share)
// }
// We can adapt this later to accept whole dollar values and calculate
// numOfUnits from that.
app.post('/transportfolio', postPortfolioEntry, (req, res) =>{
    if (req.totalValue){
        res.status(200).json({success:true, data:req.totalValue})
    }
    else
    {
        res.status(400).json({success:false, msg:'Error while posting new stock purchase'})
    }
})

// This is the API for selling stocks. Note that although this is a 
// delete request, it returns a value...in particular the total value of 
// what they just sold. This should immediately be used to present the
// user with what money they can reinvest. When making this DELETE 
// request, the following JSON input is expected to  be passed in the 
// req.body:
// {
//      "userID": (whatever user ID),
//      "portID": (whatever portfolio ID),
//      "stockName": (whatever stock ticker name as a string)
// }
// We can adapt this later to accept whole dollar values and calculate
// numOfUnits from that.
app.delete('/transportfolio', sellPortfolioEntry, (req, res) =>{
    if (req.saleValue){
        res.status(200).json({success:true, data:req.saleValue})
    }
    else
    {
        res.status(400).json({success:false, msg:'Error while selling stock'})
    }
})

// This is the API for the leaderboard and should be called whenever the
// user inspects the rankings page. Right now, it doesn't expect any sort
// of body--it will always default to return everyone's ranking. Later, 
// we can enhance the body to return filtered results.
app.get('/leaderboard', ranking, (req, res) =>{
    if (req.ranking){
        res.status(200).json({success:true, data:req.ranking})
    }
    else
    {
        res.status(400).json({success:false, msg:'Error while getting leaderboard'})
    }
})

// This is the API for all portfolio information and should be called when
// the user tries to access their portfolio page. When making this POST 
// request, the following JSON input is expected to be passed in the req.body:
// {
//      "userID": (whatever user ID),
//      "portID": (whatever portfolio ID)
// }
app.post('/portfolio', allUserPortInfo, (req, res) =>{
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
})

app.listen(3456,()=>{
    console.log('Server is listening on port 3456...')
})