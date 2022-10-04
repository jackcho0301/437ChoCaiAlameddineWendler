const express = require('express');
const app = express();

const {retrievePortInfo, retrieveCurrInfo, coi, totalReturn, stockReturn, stockHolding, roi} = require('./project-methods')

app.get('/', (req, res)=>{
    res.send('Home Page for Method Testing')
})

app.get('/retrievePortInfo', retrievePortInfo, (req, res) =>{
    if (req.retPortInfo){
        res.status(200).json({success:true, data:req.retPortInfo})
    }
    else
    {
        // Should never be hit because retPortInfo returns a not
        // found response.
        res.send('Home Page')
    }
})

app.get('/retrieveCurrInfo', retrieveCurrInfo, (req, res) =>{
    if (req.retCurrInfo){
        res.status(200).json({success:true, data:req.retCurrInfo})
    }
    else
    {
        // Should never be hit because retCurrInfo returns a not
        // found response.
        res.send('Home Page')
    }
})

app.get('/coi', coi, (req, res) =>{
    if (req.coi){
        res.status(200).json({success:true, data:req.coi})
    }
    else
    {
        // Should never be hit because coi returns a not found
        // response.
        res.send('Home Page')
    }
})

app.get('/totalReturn', totalReturn, (req, res) =>{
    if (req.totalReturn){
        res.status(200).json({success:true, data:req.totalReturn})
    }
    else
    {
        // Should never be hit because totalReturn a not found
        // response.
        res.send('Home Page')
    }
})

app.get('/stockReturn', stockReturn, (req, res) =>{
    if (req.stockReturn){
        res.status(200).json({success:true, data:req.stockReturn})
    }
    else
    {
        // Should never be hit because stockReturn returns a not 
        // found response.
        res.send('Home Page')
    }
})

app.get('/stockHolding', stockHolding, (req, res) =>{
    if (req.stockHolding){
        res.status(200).json({success:true, data:req.stockHolding})
    }
    else
    {
        // Should never be hit because stockHolding returns a not 
        // found response.
        res.send('Home Page')
    }
})

app.get('/roi', roi, (req, res) =>{
    if (req.roi){
        res.status(200).json({success:true, data:req.roi})
    }
    else
    {
        // Should never be hit because ROI returns a not 
        // found response.
        res.send('Home Page')
    }
})

app.listen(3456,()=>{
    console.log('Server is listening on port 3456...')
})