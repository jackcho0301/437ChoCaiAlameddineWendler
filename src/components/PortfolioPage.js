import React, { useEffect } from 'react'
import './PortfolioPage.css'
import { EventsContext } from '../context/Events'
import { UserContext } from '../context/User'
import { Button, IconButton, TextField, Box, Paper, Typography, Card, CardContent, TableRow, TableHead, TableCell, TableBody, Table, TableContainer, Divider, InputLabel, MenuItem, FormControl, Select } from '@mui/material'
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
            num = Number(num)
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
            if (action.type === 'pie-chart') {
                try {
                    return returns.map(item => {
                        let fillOptions = {}
                        const name = item.stockName == 'dollars' ? 'US Dollars' : item.stockName

                        return {
                            x: name,
                            y: Math.round(item.returnVal / 100),
                            ...fillOptions
                        }
                    })
                } catch (error) {
                    console.error(error)
                    return [{}]
                }
            } else if (action.type == 'table') {
                return returns.map(item => {
                    const name = item.stockName == 'dollars' ? 'US Dollars' : item.stockName
                    return [
                        name,
                        commaSeparate(Math.round(item.numOfShares * 100) / 100),
                        '$' + commaSeparate((item.returnVal).toFixed(2)),
                        `${stockHoldings[item.stockName] / 100}%`,
                    ]
                })
            }

        }

        const cashSort = payload => {
            let cashSecond = payload.sort((a, b) => {
                if (a.x == "US Dollars") {
                    return -1;
                } else if (b.x == "US Dollars") {
                    return 1;
                } else {
                    return (a.x < b.x ? -1 : 1);
                }
            })

            if (cashSecond.length > 1) {
                [cashSecond[0], cashSecond[1]] = [cashSecond[1], cashSecond[0]]
            }

            return cashSecond
        }

        const cashSortArray = payload => {
            return payload.sort((a, b) => {
                if (a[0] == "US Dollars") {
                    return -1;
                } else if (b[0] == "US Dollars") {
                    return 1;
                } else {
                    return (a[0] < b[0] ? -1 : 1);
                }
            })
        }


        switch (action.type) {
            case 'table': {
                const options = {
                    filterType: "dropdown",
                    responsive: "stacked",
                    filter: false,
                    download: false,
                    print: false,
                    customToolbarSelect: () => {}
                  };
                return (
                    <MUIDataTable
                        // title="Current Portfolio"
                        className='stock-data-table'
                        data={cashSortArray(getPortfolioData(action.payload))}
                        columns={["Stock", "Shares", "Holding Value", "Exposure"]}
                        options={options}
                    />
                )
            }
            case 'pie-chart': {
                return (
                    <VictoryPie
                        data={cashSort(getPortfolioData(action.payload))}
                        // style={{
                        //     data: {
                        //       fill: ({ datum }) => datum.fill,
                        //     }
                        //   }}
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

    const [portNumber, setPortNumber] = React.useState('1');

    useEffect(() => {
        callEvent.getPortfolio(portNumber)
        callEvent.getStats()
    }, [JSON.stringify(backend.boughtStock), JSON.stringify(backend.soldStock), backend.createdPortfolio, backend.changePortfolio])

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
            return: portfolio.totalVal - moneyInvested,
            // roi: portfolio.roiPercent
            cost: moneyInvested,
            // return: portfolio.totalVal - moneyInvested,
            roi: Math.round((portfolio.totalVal - moneyInvested) / moneyInvested * 100)
        })
    }, [JSON.stringify(backend.boughtStock), JSON.stringify(backend.soldStock), JSON.stringify(backend.dollarsAdded), JSON.stringify(backend.currentPortfolio)])

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
        callEvent.sellStock(sellStockParams.ticker, sellStockParams.number, sellValue.value / sellStockParams.number, portNumber)
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


    const handlePortSelect = (event) => {
        setPortNumber(event.target.value)
        callEvent.getPortfolio(event.target.value)
    }

    return (
        <div className='portfolio-page'>
            {/* placeholder, will be moved to user dropdown */}
            <div style={{
                // marginLeft: '20px',
                backgroundColor: 'aliceblue',
                width: '100%',
                height: '170px'
            }}>
                <h1 style={{fontSize: '40px'}}>Current Portfolio</h1>
            </div>

            {(currentReturnsPortfolio != undefined && currentReturnsPortfolio.length > 0)
                && <>
                    {/* <h3 style={{ marginBottom: 0 }}>Display Mode</h3> */}


                    <div className='portfolio-return'>
                        {/* <h2>Portfolio Return</h2> */}
                        {/* <p>{JSON.stringify(currentHoldingPortfolio, null, 2)}</p> */}
                        <div
                            className='inner-portfolio-return'
                            style={{
                                // marginRight: '30px'
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
                    <Box /* component={Paper}*/ className='select-portfolio-box'>
                        <FormControl sx={{ m: 1, minWidth: 180 }}>
                            <InputLabel id='portfolio-selector-label'>Select Portfolio</InputLabel>
                            <Select
                                labelId='portfolio-selector-label'
                                id='portfolio-selector'
                                value={portNumber}
                                label="Portfolio Number"
                                defaultValue={'1'}
                                onChange={handlePortSelect}
                            >
                                <MenuItem value={'1'}>1</MenuItem>
                                <MenuItem value={'2'}>2</MenuItem>
                                <MenuItem value={'3'}>3</MenuItem>
                                <MenuItem value={'4'}>4</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <div className='portfolio-actions'>

                        <Paper sx={{bgcolor: 'azure'}}>
                            <div className='buy-stock'>
                                {buySellControls(true)}
                                <Button
                                    className="buy-sell-btn"
                                    variant='contained'
                                    onClick={() => callEvent.buyStock(buyStockParams.ticker, buyStockParams.number, buyValue.value / buyStockParams.number, portNumber)}
                                    disabled={!buyValueString}
                                >
                                    Buy
                                </Button>
                            </div>
                            {(backend.buyMessage !== '')
                                && <>
                                    <InputLabel>
                                        {backend.buyMessage}
                                    </InputLabel>
                                </>
                            }
                        </Paper>
                        <Paper sx={{bgcolor: 'azure'}}>
                            <div className='sell-stock'>
                                {buySellControls(false)}

                                <Button
                                    className="buy-sell-btn"
                                    variant='contained'
                                    onClick={handleSellStock}
                                    disabled={!sellValueString}
                                >
                                    Sell
                                </Button>
                            </div>
                            {(backend.sellMessage != '')
                                && <>
                                    <InputLabel>
                                        {backend.sellMessage}
                                    </InputLabel>
                                </>
                            }
                        </Paper>



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
                {/* <Divider
                    orientation='vertical'
                    className='sign-in-register-divider'
                    flexItem
                /> */}
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
            <div>
            </div>




        </div>
    )
}
