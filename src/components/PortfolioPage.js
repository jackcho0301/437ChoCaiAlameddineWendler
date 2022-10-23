import React, {useState} from 'react'
import './PortfolioPage.css'
import {buyStock, sellStock} from "../context/Events"
import {TextField, Button, FormControl, Divider, Grid, Box, rgbToHex} from "@mui/material"

export default function PortfolioPage(props) {
    const [inputs, setInputs] = React.useState({
        stockname: '',
        numofunits: 0,
        initcost: 0
    })

    const setStockName = event => {
        setInputs({
            stockname: event.target.value,
            numofunits: inputs.numofunits,
            initcost: inputs.initcost
        })
    }

    const setNumOfUnits = event => {
        setInputs({
            stockname: inputs.stockname,
            numofunits: event.target.value,
            initcost: inputs.initcost
        })
    }

    const setInitCost = event => {
        setInputs({
            stockname: inputs.stockname,
            numofunits: inputs.numofunits,
            initcost: event.target.value
        })
    }

    return (
        <div id='portfolio-page'>
            <div class='trim'>
                <img src='./images/Portfolio Page.png' />
            </div>
            <TextField className='stock-name-text' placeholder="StockName" size='small' variant='outlined' onChange={event => setStockName(event)}/>
            <input type="number" className='num-of-units-text' onChange={event => setNumOfUnits(event)}/>
            <input type="number" className='init-cost-text' onChange={event => setInitCost(event)}/>
            <Button variant="contained" onClick={buyStock} className='buy-stock'>BUY</Button>
            <Button variant="contained" onClick={sellStock} className='sell-stock'>SELL</Button>
        </div>
    )
}
