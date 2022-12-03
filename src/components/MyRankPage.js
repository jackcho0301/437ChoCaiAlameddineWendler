import React, { useEffect } from 'react'
import './MyRankPage.css'
import { EventsContext } from '../context/Events'
import { LineChart, ResponsiveContainer, Legend, Tooltip, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Grid, Card, CardContent, Typography, Paper, Box } from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { green, amber } from '@mui/material/colors'

export default function MyRankPage(props) {
    const [backend, callEvent] = React.useContext(EventsContext)
    const [scoresLoaded, setScoresLoaded] = React.useState(true)
    const [titleLoaded, setTitleLoaded] = React.useState(true)
    const [statsLoaded, setStatsLoaded] = React.useState(true)
    const [currentRankings, setCurrentRankings] = React.useState([{}])
    const [currentTitle, setCurrentTitle] = React.useState([{}])
    const [currentStats, setCurrentStats] = React.useState([{}])
    const [rankNumber, setRankNumber] = React.useState(0)
    const [rankTotal, setRankTotal] = React.useState(0)
    const [rankTitle, setRankTitle] = React.useState('')
    const [rankStats, setRankStats] = React.useState([{}])

    useEffect(() => {
	if (scoresLoaded) {
	    setCurrentRankings(callEvent.getScores())
	}
    }, [scoresLoaded])

    useEffect(() => {
	if (titleLoaded) {
	    setCurrentTitle(callEvent.getTitle())
	}
    }, [titleLoaded])

    useEffect(() => {
	if (statsLoaded) {
	    setCurrentStats(callEvent.getStats())
	}
    }, [statsLoaded])

    useEffect(() => {
	if (!scoresLoaded) {
	    setScoresLoaded(true)
        }
    }, [scoresLoaded])

    useEffect(() => {
        if (!titleLoaded) {
	    setTitleLoaded(true)
	}
    }, [titleLoaded])

    useEffect(() => {
	if (!statsLoaded) {
	    setStatsLoaded(true)
	}
    }, [statsLoaded])

    function calculateTitle(score) {
        if (score <= 0) {
	    return 'Trader Who Can\'t Even';
	}
	else if (score < 5000) {
	    return 'Jim Cramer Acolyte';
	}
	else if (score < 10000) {
	    return 'Crypto Zealot';
	}
	else if (score < 11000) {
	    return 'Unpaid Stock Analyst Intern';
	}
	else if (score < 12500) {
	    return 'Envy of the Break Room';
	}
	else if (score < 15000) {
	    return 'Sure Bet Trader';
	}
	else if (score < 17500) {
	    return 'European Vacationeer'; 
	}
	else if (score < 20000) {
	    return 'Knowledgeable Broker';
	}
	else if (score < 25000) {
	    return 'Brokerage Firm Star';
	}
	else if (score < 50000) {
            return 'Warren Buffet\'s Idol';
	}
	else if (score < 100000) {
	    return 'Wolf of Wall Street';
	}
	else if (score < 500000) {
	    return 'Congressional Trade \'Consultant\'';
	}
	else if (score >= 1000000) {
	    return 'Global Elite'
	}
    }

    useEffect(() => {
	if (backend.currentTitle.data != undefined) {
	    setRankTotal(backend.allScores.length)
	    const isUser = (element) => element.name == backend.currentTitle.data.user
	    const currentUserIndex = backend.allScores.findIndex(isUser)
	    setRankNumber(currentUserIndex + 1)
	    if (backend.allScores.length > 1) {
	        setRankTitle(calculateTitle(Number(backend.allScores[currentUserIndex].score)))
	    }
	}
	if (backend.currentStats.success) {
	    setRankStats(backend.currentStats.data)
	}
    }, [backend.allScores, backend.currentTitle, backend.currentStats])

    function formatStatDate(crudeDate) {
        const FIR_QUART_NUM = "3/31"
	const FIR_QUART_STR = "1st Quarter, "
	const SEC_QUART_NUM = "6/30"
	const SEC_QUART_STR = "2nd Quarter, "
	const THR_QUART_NUM = "9/30"
	const THR_QUART_STR = "3rd Quarter, "
	const FOU_QUART_NUM = "12/31"
	const FOU_QUART_STR = "4th Quarter, "
	
	const primaryString = (new Date(crudeDate)).toLocaleDateString()
	let retString = ""
	if (primaryString.includes(FIR_QUART_NUM)) {
	    retString = FIR_QUART_STR + primaryString.slice(-4)
	}
	else if (primaryString.includes(SEC_QUART_NUM)) {
	    retString = SEC_QUART_STR + primaryString.slice(-4)
	}
	else if (primaryString.includes(THR_QUART_NUM)) {
	    retString = THR_QUART_STR + primaryString.slice(-4)
	}
	else {
	    // We can do this because all date entries are already 
            // filtered to only be the end of quarters.
	    retString = FOU_QUART_STR + primaryString.slice(-4)
	}

	return retString
    }

    return (
        <div class='my-rank-page' id='my-rank-page'>
	    <header></header>
	    <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
	    <Card item sx={{ width: '75%' }}>
	        <CardContent display="flex" fullWidth="true">
                <Typography variant="h5"><strong>Your Current Quarter Rank is:</strong></Typography>
	        {(rankNumber != 0 && rankTotal != 0)
	            && <>
			<Box display="flex" fullWidth="true">
                            <AutoAwesomeIcon fontSize="large" sx={{ color: amber[400] }}/>
		            <Typography sx={{ flexGrow: 1}} variant="h3"><strong>{rankNumber} out of {rankTotal}</strong></Typography>
			    <AutoAwesomeIcon fontSize="large" sx={{ color: amber[400] }}/>
			</Box>
		    </>
	        }
	        <Typography variant="h5"><strong>Your Lifetime Rank History is:</strong></Typography>
                {(rankStats.length > 1)
	            && <>
		        <ResponsiveContainer width="100%" aspect={3}>
		            <LineChart data={rankStats.map(stat => ({quarterEnd: formatStatDate(stat.quarterEnd), finalValue: stat.finalValue}))} margin={{right: 300}}>
		                <XAxis dataKey="quarterEnd" interval={"preserveStartEnd"} />
		                <YAxis></YAxis>
		                <Line isAnimationActive={false} dataKey="finalValue" stroke="black" dot={{stroke:"darkblue", strokeWidth:2, r:10}} />
		            </LineChart>
		        </ResponsiveContainer>
	            </>
                }
	        {(rankStats.length === 0)
		    && <>
	                <Typography variant="h6">No lifetime stats are available for this user. Check at the end of the quarter!</Typography>
	            </>
	        }
	        <p />
	        <Typography variant="h5"><strong>Your Current Title is:</strong></Typography>
	        {(rankTitle != '')
		    && <>
			<Box display="flex" fullWidth="true">
			    <AttachMoneyIcon fontSize="large" sx={{ color: green[800] }}/>
		            <Typography sx={{ flexGrow: 1}} variant="h3"><strong>{rankTitle}</strong></Typography>
			    <AttachMoneyIcon fontSize="large" sx={{ color: green[800] }}/>
			</Box>
                    </>
	        }
	        </CardContent>
	    </Card>
	    </Grid>
	</div>
    )
}
