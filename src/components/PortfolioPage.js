import React from 'react'
import './PortfolioPage.css'
import { getPortfolio, updatePortfolio, sellPortfolioItem, createPortfolio } from '../context/Events'
import { Button } from '@mui/material'

export default function PortfolioPage(props) {


    return (
        <div id='portfolio-page' style={{height: '100vh', display: 'flex', alignItems: 'true', justifyContent: 'true'}}>
            {/* <div class='trim'><img src='./images/Portfolio Page.png' /></div> */}
            <Button variant='contained' onClick={createPortfolio}>Create</Button>
            <Button variant='contained' onClick={getPortfolio}>Current</Button>
            <Button variant='contained'onClick={updatePortfolio}>Buy</Button>
            <Button variant='contained' onClick={sellPortfolioItem}>Sell</Button>

        </div>
    )
}