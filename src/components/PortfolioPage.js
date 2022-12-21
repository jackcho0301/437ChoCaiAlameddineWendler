import React, { useEffect } from 'react'
import './PortfolioPage.css'
import { EventsContext } from '../context/Events'
import { UserContext } from '../context/User'
import { Button, IconButton, TextField, Box, Paper, Typography, Card, CardContent, TableRow, TableHead, TableCell, TableBody, Table, TableContainer, Divider, InputLabel, MenuItem, FormControl, Select, Popover } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh';
import MUIDataTable from "mui-datatables";
import { StocksContext } from '../context/Stocks'
import { VictoryPie, VictoryChart } from 'victory'
import { makeStyles, createStyles } from '@mui/styles'


const DEBUG = {
    stockParams: false,
    stockState: true,
    transactionValue: false
}

const useStyles = makeStyles((theme) =>
createStyles({
    popoverRoot: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        style: {
            height: '50px',
            textTransform: "uppercase"
        }

    },
})
)

export default function PortfolioPage(props) {
    const classes = useStyles()

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

    const [controlsActive, setControlsActive] = React.useState(false)

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
                    customToolbarSelect: () => { }
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
                        colorScale={"qualitative"}
                        height={750}
                        width={2000}
                    />
                )
            }
        }
    }, []);

    const [stocks, updateStocks] = React.useContext(StocksContext)

    const [portNumber, setPortNumber] = React.useState('1');

    const [buyModalOpen, setBuyModalOpen] = React.useState(false)
    const [sellModalOpen, setSellModalOpen] = React.useState(false)

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
            val: portfolio.totalVal,
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

        const button = () => {
            if (isBuy) {
                return (
                    <Button
                        className="buy-sell-btn"
                        variant='contained'
                        onClick={() => callEvent.buyStock(buyStockParams.ticker, buyStockParams.number, buyValue.value / buyStockParams.number, portNumber)}
                        disabled={!buyValueString}
                        style={{width: '100%', position: 'absolute', bottom: 0}}
                    >
                        Buy
                    </Button>
                )
            }
            else {
                return (

                    <Button
                        className="buy-sell-btn"
                        variant='contained'
                        onClick={handleSellStock}
                        disabled={!sellValueString}
                        style={{width: '100%', position: 'absolute', bottom: 0}}
                    >
                        Sell
                    </Button>
                )
            }
        }

        return (
            <>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                >
                    <TextField
                        // id="stock-ticker"
                        label="Ticker"
                        variant="filled"
                        size="small"
                        onChange={event => changeTicker(event)}
                        inputProps={{ style: { textTransform: "uppercase", height: '10px', margin: '25px 0', width: '80%' } }}
                    />
                    <TextField
                        // id="stock-number"
                        label="Number of Shares"
                        variant="filled"
                        size="small"
                        onChange={event => changeNumber(event)}
                        inputProps={{ style: { height: '10px' } }}

                    />
                    <TextField
                        className='preview-value'
                        label={isBuy ? "Buy Price" : "Sale Value"}
                        variant="filled"
                        size="small"
                        value={isBuy ? buyValueString : sellValueString}
                        inputProps={{ style: { height: '10px' } }}

                        disabled
                    />
                    {button()}
                </Box>
            </>
        );
    }

    const portfolioActions = type => {
        return (

            <div className='portfolio-actions'>
                {/* <Button
                onClick={() => setControlsActive(false)}
                variant='contained'
                color={'error'}
                style={{ marginTop: '30px' }}
            >
                Hide Controls
            </Button> */}

                {type === 'buy' &&
                    <div className='buy-stock'>
                        {buySellControls(true)}
                        {(backend.buyMessage !== '')
                        && <>
                            <InputLabel>
                                {backend.buyMessage}
                            </InputLabel>
                        </>
                    }

                    </div>

}
                {type === 'sell' &&
                        <div className='sell-stock'>
                            {buySellControls(false)}
                            {(backend.sellMessage != '')
                            && <>
                                <InputLabel>
                                    {backend.sellMessage}
                                </InputLabel>
                            </>
                        }

                        </div>

                }



            </div>
        )
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
            <div style={{
                backgroundColor: 'azure',
                width: '100%',
                height: '170px'
            }}>
                <h1 style={{ fontSize: '40px' }}>Portfolio {portNumber}</h1>
                <h1 style={{ marginBottom: 0 }}>${commaSeparate(portfolioStats.val)}</h1>
            </div>
            <hr style={{ borderTop: '5px solid black', width: '100vw', margin: 0 }} />
            {(currentReturnsPortfolio != undefined && currentReturnsPortfolio.length > 0)
                && <>
                    <div className='portfolio-return'>
                        <div
                            className='inner-portfolio-return'
                            style={{
                                fontSize: '25px'
                            }}
                        >
                            <div>
                                <h3>Invested</h3>
                                <p style={{ fontSize: '30px' }}>${commaSeparate(portfolioStats.cost)}</p>
                            </div>
                            <div>
                                <h3>Profit</h3>
                                <p style={{ fontSize: '30px' }}>${commaSeparate(portfolioStats.return)}</p>
                            </div>
                            <div>
                                <h3>ROI</h3>
                                <p style={{ fontSize: '30px' }}>{commaSeparate(portfolioStats.roi)}%</p>
                            </div>

                        </div>
                    </div>
                    <Box className='select-portfolio-box'>
                        <FormControl sx={{ m: 1, minWidth: 180 }}>
                            {/* <InputLabel id='portfolio-selector-label'>Select Portfolio</InputLabel> */}
                            {/* <div> */}
                            {/* <h3>Score</h3> */}
                            {/* <p style={{ fontSize: '30px', fontWeight: 'bold' }}>${commaSeparate(portfolioStats.val)}</p> */}
                            {/* </div> */}
                            {/* <Select
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
                            </Select> */}
                        </FormControl>
                    </Box>
                    {backend.portfolioLoaded && <div className='portfolio-display-mode'>
                        <Button
                            variant='contained'
                            style={{
                                backgroundColor: displayMode == 'pie-chart' ? 'black' : 'white',
                                color: displayMode == 'pie-chart' ? 'white' : 'black'
                            }}
                            onClick={() => setDisplayMode('pie-chart')}
                        >
                            Chart
                        </Button>
                        <Button
                            variant='contained'
                            style={{  // TODO: refactor to makestyles
                                backgroundColor: displayMode == 'pie-chart' ? 'white' : 'black',
                                color: displayMode == 'pie-chart' ? 'black' : 'white'
                            }}
                            onClick={() => setDisplayMode('table')}
                        >
                            Table
                        </Button>

                    </div>}

                    <div className='stock-display'>
                        {currentPortfolio}
                    </div>

                </>}

            <div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                    onClick={() => { setControlsActive(true); setBuyModalOpen(true) }}
                    variant='contained'
                    color={'primary'}
                    size='large'
                    style={{ margin: '30px 10px 0 0', visibility: controlsActive ? 'visible' : 'visible' }}
                >
                    Buy
                </Button>
                <Popover
                    open={buyModalOpen}
                    onClose={() => setBuyModalOpen(false)}
                    anchorReference={"none"}
                    classes={{
                        root: classes.popoverRoot,
                    }}
                    PaperProps={{
                        style: { width: '300px', height: '400px' },
                    }}
                    BackdropProps={{ invisible: false }}
                >
                    <h1>Buy Stock</h1>
                    {portfolioActions('buy')}
                </Popover>
                <Button
                    onClick={() => { setControlsActive(true); setSellModalOpen(true) }}
                    variant='contained'
                    color={'primary'}
                    size='large'
                    style={{ margin: '30px 0 0 10px', visibility: controlsActive ? 'visible' : 'visible' }}
                >
                    Sell
                </Button>
                <Popover
                    open={sellModalOpen}
                    onClose={() => setSellModalOpen(false)}
                    anchorReference={"none"}
                    classes={{
                        root: classes.popoverRoot,
                    }}
                    PaperProps={{
                        style: { width: '480px', height: '500px' },
                    }}
                    BackdropProps={{ invisible: false }}
                >
                    {portfolioActions('sell')}
                </Popover>
            </div>


        </div>
    )
}
