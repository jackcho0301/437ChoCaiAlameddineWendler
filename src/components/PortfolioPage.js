import React, { useEffect } from 'react'
import './PortfolioPage.css'
import { EventsContext } from '../context/Events'
import { UserContext } from '../context/User'
import { Button, IconButton, TextField, Box, Paper, Typography, Card, CardContent, TableRow, TableHead, TableCell, TableBody, Table, TableContainer, Divider } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh';
import MUIDataTable from "mui-datatables";
import { StocksContext } from '../context/Stocks'
import { VictoryPie, VictoryChart } from 'victory'

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

    const [displayMode, setDisplayMode] = React.useState('pie-chart')

    const commaSeparate = num => {
        try {
            return num.toLocaleString('en', { useGrouping: true })
        } catch {
            return num
        }
    }

    const [currentPortfolio, reduceCurrentPortfolio] = React.useReducer((currentPortfolio, action) => {
        const stockHoldings = {}
        try {
            for (const stock of currentHoldingPortfolio) {
                stockHoldings[stock.stockName] = Math.round(stock.holding * 100)
            }
        } catch {
            ;
        }

        const getPortfolioData = returns => {
            console.log(returns)
            if (action.type === 'pie-chart') {
                try {
                    return returns.map(item => {
                        return {
                            x: item.stockName,
                            y: Math.round(item.returnVal / 100)
                        }
                    })
                } catch (error) {
                    console.error(error)
                    return [{}]
                }
            } else if (action.type == 'table') {
                return returns.map(item => {
                    return [
                        item.stockName,
                        '$' + commaSeparate(item.returnVal.toFixed(2)),
                        `${(stockHoldings[item.stockName] / 100)}%`,
                    ]
                })
            }

        }


        switch (action.type) {
            case 'table': {
                return (
                    <MUIDataTable
                        // title="Current Portfolio"
                        className='stock-data-table'
                        data={getPortfolioData(action.payload)}
                        columns={["Stock", "Holding Value", "Holding Percent"]}
                    />
                )
            }
            case 'pie-chart': {
                return (
                    <VictoryPie
                        data={getPortfolioData(action.payload)}
                        colorScale={"qualitative"}
                        // style={{
                        //     data: {
                        //         fill: ({ x }) => {
                        //             if (x == 'dollars') {
                        //                 return 'green'
                        //             }
                        //         }
                        //     }
                        // }}
                        height={750}
                        width={2000}
                    // backgroundStyle={{ fill: "tomato", opacity: 0.6 }}
                    // backgroundPadding={{ bottom: 5, top: 5 }}

                    />
                )
            }
        }
    }, []);

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
        callEvent.getStats()
    }, [backend.boughtStock, backend.soldStock, backend.createdPortfolio])

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
        const moneyInvested = 10000
        setPortfolioStats({
            // cost: portfolio.coi,
            cost: moneyInvested,
            return: portfolio.totalVal - moneyInvested,
            roi: Math.round((portfolio.totalVal - moneyInvested) / moneyInvested * 100) / 100
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
            setSellValue({
                value: 0,
                currency: 'USD'
            })
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
            setBuyValue({
                value: 0,
                currency: 'USD'
            })
            DEBUG.transactionValue && console.log(stocks)
            DEBUG.transactionValue && console.log(error)
        }
    }, [stocks, buyStockParams])

    useEffect(() => {
        DEBUG.stockState && console.log("Stock state:", stocks)
    }, [stocks])

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
                    // id="stock-ticker"
                    label="Ticker"
                    variant="filled"
                    onChange={event => changeTicker(event)}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                />
                <TextField
                    // id="stock-number"
                    label="Number of Shares"
                    variant="filled"
                    onChange={event => changeNumber(event)}
                />
                <TextField
                    className='preview-value'
                    label={isBuy ? "Buy Price" : "Sale Value"}
                    variant="filled"
                    value={isBuy ? buyValueString : sellValueString}
                    disabled
                />
            </Box>
        );
    }



    const handleSellStock = () => {
        callEvent.sellStock(sellStockParams.ticker, sellStockParams.number, sellValue.value/sellStockParams.number)
    }

    const calculateSellPrice = () => {
        if (sellStockParams.ticker && sellStockParams.number) {
            updateStocks.new(sellStockParams.ticker)
            updateStocks.price(sellStockParams.ticker)
        }
    }

    const calculateBuyPrice = () => {
        if (buyStockParams.ticker && buyStockParams.number) {
            updateStocks.new(buyStockParams.ticker)
            updateStocks.price(buyStockParams.ticker)
        }
    }

    useEffect(() => {
        calculateBuyPrice()
        calculateSellPrice()
    }, [buyStockParams, sellStockParams])




    const buyValueString = buyValue.value ? `${commaSeparate(((Math.round(buyValue.value * 100)) / 100).toFixed(2))} ${buyValue.currency}` : ''
    const sellValueString = sellValue.value ? `${commaSeparate(((Math.round(sellValue.value * 100)) / 100).toFixed(2))} ${sellValue.currency}` : ''



    useEffect(() => {
        currentReturnsPortfolio && reduceCurrentPortfolio({ type: displayMode, payload: currentReturnsPortfolio })
    }, [currentReturnsPortfolio, displayMode])




    return (
        <div className='portfolio-page'>
            {/* placeholder, will be moved to user dropdown */}
            <div style={{
                marginLeft: '20px',
                backgroundColor: 'aliceblue',
                width: '100%'
            }}>
                <h1>Current Portfolio</h1>
            </div>
            {/* <div className='portfolio-text-and-refresh'>
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
            </div> */}

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
                    {/* <h3 style={{ marginBottom: 0 }}>Display Mode</h3> */}


                    <div className='portfolio-return'>
                        {/* <h2>Portfolio Return</h2> */}
                        {/* <p>{JSON.stringify(currentHoldingPortfolio, null, 2)}</p> */}
                        <div
                            className='inner-portfolio-return'
                            style={{
                                marginRight: '30px'
                            }}
                        >
                            <div>
                                <h3>Total Invested</h3>
                                <p>${commaSeparate(portfolioStats.cost)}</p>
                            </div>
                            <div>
                                <h3>Total Profit</h3>
                                <p>${commaSeparate(portfolioStats.return)}</p>
                            </div>
                            <div>
                                <h3>Total ROI</h3>
                                <p>{commaSeparate(portfolioStats.roi)}%</p>
                            </div>
                        </div>
                    </div>
                    <div className='stock-display'>
                        {currentPortfolio}
                    </div>

                </>}
            {backend.portfolioLoaded && <div className='portfolio-display-mode'>
                <Button
                    variant='contained'
                    style={{
                        backgroundColor: displayMode == 'pie-chart' ? 'black' : 'rgb(245,245,245)',
                        color: displayMode == 'pie-chart' ? 'white' : 'black'
                    }}
                    onClick={() => setDisplayMode('pie-chart')}
                >
                    Chart
                </Button>
                <Divider
                    orientation='vertical'
                    className='sign-in-register-divider'
                    flexItem
                />
                <Button
                    variant='contained'
                    style={{  // TODO: refactor to makestyles
                        backgroundColor: displayMode == 'pie-chart' ? 'rgb(245,245,245)' : 'black',
                        color: displayMode == 'pie-chart' ? 'black' : 'white'
                    }}
                    onClick={() => setDisplayMode('table')}
                >
                    Table
                </Button>

            </div>}

            <div className='portfolio-actions'>
                {!!backend.portfolioLoaded || <Button variant='contained' onClick={() => { callEvent.createPortfolio(); callEvent.getPortfolio() }}>New Portfolio</Button>}
                {/* <div className='preview-value'>
                    <div>
                        <h3>Buy Price</h3>
                        <h4>{buyValueString}</h4>
                    </div>
                    <div>
                        <h3>Sale Value</h3>
                        <h4>{sellValueString}</h4>
                    </div>
                </div> */}

                <div className='buy-stock'>
                    <Button
                        variant='contained'
                        onClick={() => callEvent.buyStock(buyStockParams.ticker, buyStockParams.number, buyValue.value/buyStockParams.number)}
                        disabled={!buyValueString}
                    >
                        Buy
                    </Button>
                    {buySellControls(true)}
                    {/* <Table className='preview-buy-table' options={{padding: 'dense'}}>
                        <TableHead>
                            <TableRow className='preview-buy-table-head-row'>
                                <TableCell size='small'>Stock</TableCell>
                                <TableCell size='small'>Shares</TableCell>
                                <TableCell size='small'>Cost</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{height: '10px'}}>{buyStockParams.ticker}</TableCell>
                                <TableCell sx={{height: '10px'}}>{buyStockParams.number}</TableCell>
                                <TableCell sx={{height: '10px'}}>{`${((Math.round(buyValue.value * 100)) / 100).toFixed(2)} ${buyValue.currency}`}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table> */}
                    {/* <Button
                        variant='contained'
                        onClick={calculateBuyPrice}
                    >
                        Preview Cost
                    </Button> */}

                </div>
                <div className='sell-stock'>
                    <Button
                        variant='contained'
                        onClick={handleSellStock}
                        disabled={!sellValueString}
                    // disabled={!sellStockParams.ticker}
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