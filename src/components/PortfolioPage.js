import React, { useEffect } from 'react'
import './PortfolioPage.css'
import { EventsContext } from '../context/Events'
import { UserContext } from '../context/User'
import { Button, IconButton } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh';
import MUIDataTable from "mui-datatables";


export default function PortfolioPage(props) {
    const [user, modifyUser] = React.useContext(UserContext)
    const [backend, callEvent] = React.useContext(EventsContext)
    const [currentReturnsPortfolio, setCurrentReturnsPortfolio] = React.useState([{}])
    const [currentHoldingPortfolio, setCurrentHoldingPortfolio] = React.useState([{}])
    const [displayPortfolio, setDisplayPortfolio] = React.useState([{}])
    const [portfolioStats, setPortfolioStats] = React.useState({
        cost: 0,
        return: 0,
        roi: 0
    })
    const [toggleRefresh, setToggleRefresh] = React.useState(false)

    // useEffect(() => {
    //     modifyUser({type: "portfolio", value: getPortfolio())
    // }, [])

    useEffect(() => {
        callEvent.getPortfolio()
    }, [])

    useEffect(() => {
        console.log('Current returns portfolio:', currentReturnsPortfolio)
    }, [currentReturnsPortfolio])

    useEffect(() => {
        const portfolio = backend.currentPortfolio
        setCurrentReturnsPortfolio(portfolio.stockReturns)
        setCurrentHoldingPortfolio(portfolio.stockHoldings)
        // if(JSON.stringify(currentHoldingPortfolio) != '{}' && 
        // currentHoldingPortfolio != undefined && 
        // JSON.stringify(currentReturnsPortfolio) != '{}' &&
        // currentReturnsPortfolio != undefined) {
        //     let tablePortfolio = JSON.parse(JSON.stringify(currentHoldingPortfolio))
        //     console.log(tablePortfolio)
        //     tablePortfolio.forEach((stock, idx) => {
        //         stock = { ...stock, ...currentHoldingPortfolio[idx] }
        //     })
        //     console.log('TABLEE', tablePortfolio)
        //     setDisplayPortfolio(tablePortfolio)
        // }
        setPortfolioStats({
            cost: portfolio.coi,
            return: portfolio.totalReturnVal,
            roi: Math.round(portfolio.roiPercent*100)/100
        })
        setToggleRefresh(false)
    }, [backend.boughtStock, backend.soldStock, backend.dollarsAdded, backend.currentPortfolio, toggleRefresh])


    // console.log(displayPortfolio)

    const stockHoldings = {}
    try {
        for (const stock of currentHoldingPortfolio) {
            stockHoldings[stock.stockName] = Math.round(stock.holding * 100)
        }
    } catch {
        ;
    }

    const REFRESH_RATE = 1000;

    useEffect(() => {
        const interval = setInterval(() => {
            callEvent.getPortfolio();
        }, REFRESH_RATE);
        return () => clearInterval(interval);
    }, [])

    return (
        <div className='portfolio-page'>
            <div className='portfolio-text-and-refresh'>
                <IconButton
                    variant='contained'
                    onClick={callEvent.getPortfolio}
                    className='space-filler-iconbutton'
                >
                    <RefreshIcon fontSize='large' />
                </IconButton>
                <h1>Current Portfolio</h1>
                <IconButton
                    onClick={callEvent.getPortfolio}
                    className='refresh-portfolio'
                >
                    <RefreshIcon fontSize='large' />
                </IconButton>
            </div>

            {/* {JSON.stringify(displayPortfolio) == '{}' ||
                <PortfolioTable rows={displayPortfolio} />} */}



            {/* {(currentHoldingPortfolio != undefined && currentHoldingPortfolio.length > 0) &&
                <MUIDataTable
                    title="Stock Holdings"
                    data={currentHoldingPortfolio.map(item => {
                        return [
                            item.stockName,
                            item.holding,
                        ]
                    })}
                    columns={["Stock", "Holding"]}
                />
            } */}
            {/* <p>{JSON.stringify(currentReturnsPortfolio, null, 2)}</p> */}
            <div className='portfolio-return'>
                {/* <h2>Portfolio Return</h2> */}
                {/* <p>{JSON.stringify(currentHoldingPortfolio, null, 2)}</p> */}
                <div className='inner-portfolio-return'>
                    <div>
                        <h3>Total Invested</h3>
                        <p>{portfolioStats.cost}</p>
                    </div>
                    <div>
                        <h3>Total Profit</h3>
                        <p>{portfolioStats.return}</p>
                    </div>
                    <div>
                        <h3>ROI</h3>
                        <p>{portfolioStats.roi}%</p>
                    </div>
                </div>
            </div>

            {(currentReturnsPortfolio != undefined && currentReturnsPortfolio.length > 0) &&
                <MUIDataTable
                    title="Stock Holdings"
                    className='stock-data-table'
                    data={currentReturnsPortfolio.map(item => {
                        return [
                            item.stockName,
                            item.returnVal,
                            `${(stockHoldings[item.stockName]/100)}%`,
                            `${Math.round(item.return/stockHoldings[item.stockName])}%`,
                        ]
                    })}
                    columns={["Stock", "Holding ($)", "Holding (%)", "ROI"]}
                />
            }

            <div className='portfolio-actions'>
                <Button variant='contained' onClick={() => { callEvent.sellStock('AAPL'); callEvent.getPortfolio() }}>Sell AAPL</Button>
                <Button variant='contained' onClick={() => { callEvent.createPortfolio(); callEvent.getPortfolio() }}>New Portfolio</Button>
                <Button variant='contained' onClick={() => { callEvent.buyStock('AAPL', 1, 1); callEvent.getPortfolio() }}>Buy AAPL</Button>
            </div>


        </div>
    )
}
