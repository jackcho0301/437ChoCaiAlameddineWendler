import React, { useEffect } from 'react'
import './PortfolioPage.css'
import { EventsContext } from '../context/Events'
import { UserContext } from '../context/User'
import { Button, IconButton, TextField, Box, Paper, Typography, Card, CardContent, TableRow, TableHead, TableCell, TableBody, Table, TableContainer } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh';
import MUIDataTable from "mui-datatables";
import { StocksContext } from '../context/Stocks'

const DEBUG = {
    stockParams: false,
    stockState: true,
    transactionValue: false
}

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
    const [buyStockParams, setBuyStockParams] = React.useState({
        ticker: '',
        number: 0
    })
    const [sellStockParams, setSellStockParams] = React.useState({
        ticker: '',
        number: 0,
    })
    const [sellValue, setSellValue] = React.useState({
        value: 0,
        currency: ''
    })
    const [buyValue, setBuyValue] = React.useState({
        value: 0,
        currency: ''
    })



    const [stocks, updateStocks] = React.useContext(StocksContext)
    // console.log('stock state',stocks,'update', updateStocks)

    // useEffect(() => {
    //     modifyUser({type: "portfolio", value: getPortfolio())
    // }, [])

    // useEffect(() => {
    //     callEvent.getPortfolio()
    // }, [backend])

    useEffect(() => {
        callEvent.getPortfolio()
    }, [backend.boughtStock, backend.soldStock])

    useEffect(() => {
        console.log('Current returns portfolio:', currentReturnsPortfolio)
    }, [currentReturnsPortfolio])

    useEffect(() => {
        console.log('Current holding portfolio:', currentHoldingPortfolio)
    }, [currentHoldingPortfolio])

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
            roi: Math.round(portfolio.roiPercent * 100) / 100
        })
        setToggleRefresh(false)
    }, [backend.boughtStock, backend.soldStock, backend.dollarsAdded, backend.currentPortfolio, toggleRefresh])

    useEffect(() => {
        DEBUG.stockParams && console.log('stock params (buy=0, sell=1)')
        DEBUG.stockParams && console.table([buyStockParams, sellStockParams])
    }, [buyStockParams, sellStockParams])

    useEffect(() => {
        try {
            setSellValue({
                value: stocks[sellStockParams.ticker].price.price * sellStockParams.number,
                currency: stocks[sellStockParams.ticker].price.currency
            })
        } catch (error) {
            DEBUG.transactionValue && console.log(stocks)
            DEBUG.transactionValue && console.log(error)
        }

    }, [stocks, sellStockParams])

    useEffect(() => {
        try {
            setBuyValue({
                value: stocks[buyStockParams.ticker].price.price * buyStockParams.number,
                currency: stocks[buyStockParams.ticker].price.currency
            })
        } catch (error) {
            DEBUG.transactionValue && console.log(stocks)
            DEBUG.transactionValue && console.log(error)
        }
    }, [stocks, buyStockParams])

    useEffect(() => {
        DEBUG.stockState && console.log("Stock state:", stocks)
    }, [stocks])

    // console.log(displayPortfolio)

    const stockHoldings = {}
    try {
        for (const stock of currentHoldingPortfolio) {
            stockHoldings[stock.stockName] = Math.round(stock.holding * 100)
        }
    } catch {
        ;
    }

    const buySellControls = isBuy => {
        const changeTicker = event => {
            isBuy ?
                setBuyStockParams({
                    number: buyStockParams.number,
                    ticker: event.target.value.toUpperCase()
                })
                :
                setSellStockParams({
                    number: sellStockParams.number,
                    ticker: event.target.value.toUpperCase()
                })
        }
        const changeNumber = event => {
            isBuy ?
                setBuyStockParams({
                    ticker: buyStockParams.ticker,
                    number: event.target.value
                })
                :
                setSellStockParams({
                    ticker: sellStockParams.ticker,
                    number: event.target.value
                })
        }

        return (
            <Box
                component="form"
                //   sx={{
                //     '& > :not(style)': { m: 1, width: '25ch' },
                //   }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="stock-ticker"
                    label="Ticker"
                    variant="filled"
                    onChange={event => changeTicker(event)}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                />
                {isBuy &&
                    <TextField
                        id="stock-number"
                        label="Number of Shares"
                        variant="filled"
                        onChange={event => changeNumber(event)}
                    />}
            </Box>
        );
    }



    const handleSellStock = () => {
        // updateStocks.new(sellStockParams.ticker)
        // updateStocks.price(sellStockParams.ticker)
        callEvent.sellStock(sellStockParams.ticker)
    }

    const calculateSellPrice = () => {
        updateStocks.new(sellStockParams.ticker)
        updateStocks.price(sellStockParams.ticker)
    }

    const calculateBuyPrice = () => {
        updateStocks.new(buyStockParams.ticker)
        updateStocks.price(buyStockParams.ticker)
    }

    return (
        <div className='portfolio-page'>
            {/* placeholder, will be moved to user dropdown */}
            <Button onClick={callEvent.logout}>Log out</Button>
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
                    onClick={() => { callEvent.getPortfolio(); updateStocks.new('AAPL'); updateStocks.price('AAPL') }}
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

            {(currentReturnsPortfolio != undefined && currentReturnsPortfolio.length > 0)
                && <>
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
                    <MUIDataTable
                        title="Stock Holdings"
                        className='stock-data-table'
                        data={currentReturnsPortfolio.map(item => {
                            return [
                                item.stockName,
                                item.return,
                                `${(stockHoldings[item.stockName] / 100)}%`,
                                // `${Math.round(item.return / stockHoldings[item.stockName])}%`,
                            ]
                        })}
                        columns={["Stock", "Holding ($)", "Holding (%)"]}
                    />
                </>}

            <div className='portfolio-actions'>
                <Button variant='contained' onClick={() => { callEvent.createPortfolio(); callEvent.getPortfolio() }}>New Portfolio</Button>
                <div className='buy-stock'>
                    <Button
                        variant='contained'
                        onClick={() => callEvent.buyStock(buyStockParams.ticker, buyStockParams.number)}
                        disabled={!(buyStockParams.ticker && buyStockParams.number)}
                    >
                        Buy
                    </Button>
                    {buySellControls(true)}
                        <Table className='preview-buy-table'>
                            <TableHead>
                                <TableRow className='preview-buy-table-head-row'>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Shares</TableCell>
                                    <TableCell>Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{buyStockParams.ticker}</TableCell>
                                    <TableCell>{buyStockParams.number}</TableCell>
                                    <TableCell>{`${((Math.round(buyValue.value * 100)) / 100).toFixed(2)} ${buyValue.currency}`}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    <Button
                        variant='contained'
                        onClick={calculateBuyPrice}
                    >
                        Preview Cost
                    </Button>

                </div>
                <div className='sell-stock'>
                    <Button
                        variant='contained'
                        onClick={handleSellStock}
                        // disabled={!(sellStockParams.ticker && sellStockParams.number)}
                        disabled={!sellStockParams.ticker}
                    >
                        Sell
                    </Button>
                    {buySellControls(false)}
                    {/* <Card
                        elevation={3}
                        className="sell-price"
                    >
                        <CardContent>
                            <h1>Total Sell Value</h1>
                            <Typography>
                                {sellValue}
                            </Typography>
                            <Button
                                variant='contained'
                                onClick={calculateSellPrice}
                            >
                                Refresh
                            </Button>

                        </CardContent>
                    </Card> */}
                </div>


            </div>


        </div>
    )
}