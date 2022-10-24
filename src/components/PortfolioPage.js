import React, { useEffect } from 'react'
import './PortfolioPage.css'
import { EventsContext } from '../context/Events'
import { UserContext } from '../context/User'
import { Button } from '@mui/material'

export default function PortfolioPage(props) {
    const [user, modifyUser] = React.useContext(UserContext)
    const [backend, callEvent] = React.useContext(EventsContext)
    const [currentReturnsPortfolio, setCurrentReturnsPortfolio] = React.useState({})
    const [currentHoldingPortfolio, setCurrentHoldingPortfolio] = React.useState({})
    const [portfolioStats, setPortfolioStats] = React.useState({
        cost: 0,
        return: 0
    })
    const [toggleRefresh, setToggleRefresh] = React.useState(false)

    // useEffect(() => {
    //     modifyUser({type: "portfolio", value: getPortfolio())
    // }, [])

    useEffect(() => {
        callEvent.getPortfolio()
    }, [])

    useEffect(() => {
        console.log('Current portfolio:', currentReturnsPortfolio)
    }, [currentReturnsPortfolio])

    useEffect(() => {
        const portfolio = backend.currentPortfolio
        setCurrentReturnsPortfolio(portfolio.stockReturns)
        setCurrentHoldingPortfolio(portfolio.stockHoldings)
        setPortfolioStats({
            cost: portfolio.coi,
            return: portfolio.totalReturnVal
        })
        setToggleRefresh(false)
    }, [backend.boughtStock, backend.soldStock, backend.dollarsAdded, backend.currentPortfolio, toggleRefresh])


    return (
        <div className='portfolio-page'>
            {/* <div class='trim'><img src='./images/Portfolio Page.png' /></div> */}
            <h1>Current Portfolio</h1>
            <p>{JSON.stringify(currentReturnsPortfolio, null, 2)}</p>
            <div className='portfolio-return'>
            <h1>Portfolio Return</h1>
            <p>{JSON.stringify(currentHoldingPortfolio, null, 2)}</p>
            <h3>Total Invested</h3>
            <p>{portfolioStats.cost}</p>
            <h3>Total Return</h3>
            <p>{portfolioStats.return}</p>
            </div>

            <div className='portfolio-actions'>
            <Button variant='contained' onClick={() => {callEvent.addDollars(); callEvent.getPortfolio()}}>Add Dollars</Button>
            <Button variant='contained' onClick={() => {callEvent.getPortfolio()}}>Current</Button>
            <Button variant='contained'onClick={() => {callEvent.buyStock('F', 1, 1); callEvent.getPortfolio()}}>Buy</Button>
            <Button variant='contained' onClick={() => {callEvent.sellStock('F'); callEvent.getPortfolio()}}>Sell</Button>
            </div>


        </div>
    )
}