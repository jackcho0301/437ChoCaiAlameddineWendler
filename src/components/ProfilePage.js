import React, { useEffect } from 'react'
import './ProfilePage.css'
import { EventsContext } from '../context/Events'
import { Button, IconButton, TextField, Box, InputLabel, MenuItem, FormControl, Select, Card, CardContent, Typography, Grid, Divider, List, ListItem, ListItemText } from '@mui/material'
import { LineChart, ResponsiveContainer, Legend, Tooltip, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import RefreshIcon from '@mui/icons-material/Refresh'
import { makeStyles, createStyles } from '@mui/styles'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { green, amber } from '@mui/material/colors'

export default function ProfilePage(props) {
    const [backend, callEvent] = React.useContext(EventsContext)
    const [currentGroupMemberships, setCurrentGroupMemberships] = React.useState([{}])
    const [currentGroupOwnships, setCurrentGroupOwnships] = React.useState([{}])
    const [createGroupParams, setCreateGroupParams] = React.useState({
        title: ''
    })
    const [createGroupMessage, setCreateGroupMessage] = React.useState([{}])
    const [addGroupMemberParams, setAddGroupMemberParams] = React.useState({
	name: '',
	title: ''
    })
    const [addMemberMessage, setAddMemberMessage] = React.useState([{}])

    const [myProfile, setMyProfile] = React.useState(<></>)
    const [prefPortfolio, setPrefPortfolio] = React.useState(0)
    const [prefPortfolioParams, setPrefPortfolioParams] = React.useState({
        portID: ''        
    })
   
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

    const useStyles = makeStyles((theme: Theme) =>
	createStyles({
	    input: {
		height: 43
	    }
	})
    )

    const classes = useStyles()

    useEffect(() => {
	setCurrentGroupMemberships(backend.groupMemberships)
    }, [backend.groupMemberships])

    useEffect(() => {
	setCurrentGroupOwnships(backend.groupOwnships)
    }, [backend.groupOwnships])

    useEffect(() => {
	setCreateGroupMessage(backend.createGroupResponse)
    }, [backend.createGroupResponse])

    useEffect(() => {
	setAddMemberMessage(backend.addMemberResponse)
    }, [backend.addMemberResponse])

    useEffect(() => {
        console.log("!!" + JSON.stringify(backend.profile))
	setMyProfile(renderProfile(backend.profile)) 
    }, [backend.profile])

    useEffect(() => {
	callEvent.getMyProfile()
	callEvent.getPrefPortfolio()
    }, [])

    useEffect(() => {
	setPrefPortfolio(backend.prefPortNumber)
    }, [backend.prefPortNumber])

    useEffect(() => {
	callEvent.getMyProfile()
	callEvent.getPrefPortfolio()
	callEvent.getScores()
	callEvent.getTitle()
    }, [prefPortfolio])

    useEffect(() => {
	callEvent.changePrefPortfolio(prefPortfolioParams.portID)
    }, [prefPortfolioParams])

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
				
    const renderProfile = profile => {
	return (
	    <Grid item xs={8}>
	    <Card item xs={{maxWidth: 600}}>
	    <CardContent id="profile-info-div">
		<Typography gutterBottom variant="h4"><strong>Username:</strong> {profile.username}</Typography>
		<img src={profile.profilePicPath} width="100px" length="100px" />
		<Typography variant="h5"><strong>Score:</strong> {profile.score}</Typography>
		<Typography variant="h5"><strong>Rank:</strong> {profile.rank} out of {profile.rankTotal}</Typography>
		<Typography variant="h5">
		    <strong>Your Current Title is: </strong>
		    {(rankTitle != '')
			&& <>
			    <AttachMoneyIcon fontSize="small" sx={{ color: green[800] }}/>
			    <strong>{rankTitle}</strong>
			    <AttachMoneyIcon fontSize="small" sx={{ color: green[800] }}/>
			</>
		    }
		</Typography>
		{/* <img src="http://localhost:3000/6355a789f60cadf72eb90954.png" width="100px" length="100px" /> */}
                <Typography variant="h5"><strong>Your Lifetime Rank History is:</strong></Typography>
		{(rankStats.length > 1)
		    && <>
		        <ResponsiveContainer width="100%" aspect={3}>
		            <LineChart data={rankStats.map(stat => ({quarterEnd: formatStatDate(stat.quarterEnd), finalValue: stat.finalValue}))} margin={{ right: 30, left: 30}}>
		                <XAxis dataKey="quarterEnd" interval={"preserveStartEnd"} />
				<YAxis></YAxis>
				<Line isAnimationActive={false} dataKey="finalValue" stroke="black" dot={{stroke:"darkblue", strokeWidth:2, r:10}} />
			    </LineChart>
			</ResponsiveContainer>
		    </>
		}
	        {(rankStats.length === 0)
		    && <>
		        <Typography variant="subtitle1">No lifetime stats are available for this user. Check at the end of the quarter!</Typography>
		    </>
		}
	    </CardContent>
            </Card>
	    </Grid>
	)
    }

    const portfolioSelector = () => {
        const changePortfolioID = event => {
	    setPrefPortfolioParams({portID: event.target.value})
	}

	return (
	    <CardContent id='new-pref-port-select'>
                <Typography variant="h6"><strong>Preferred Portfolio</strong></Typography>
                <Typography variant="subtitle1">{prefPortfolio}</Typography>
		<Box>
		    <FormControl sx={{m:1, minWidth:180}} display="flex" fullWidth="true">
		        <InputLabel id='pref-port-select-label'>Select Preferred Portfolio</InputLabel>
		        <Select
		            labelId='pref-port-select-label'
		            id='pref-port-select'
		            label="Portfolio Number"
		            onChange={changePortfolioID}
		        >
		            <MenuItem value={'1'}>1</MenuItem>
		            <MenuItem value={'2'}>2</MenuItem>
		            <MenuItem value={'3'}>3</MenuItem>
		            <MenuItem value={'4'}>4</MenuItem>
		        </Select>
		    </FormControl>
		</Box>
	    </CardContent>
	);
    }

    const newMemberInput = () => {
        const changeNewMemberName = event => {
	    setAddGroupMemberParams({
	        name: event.target.value,
		title: addGroupMemberParams.title
	    })
	}
	const changeNewMemberGroup = event => {
	    setAddGroupMemberParams({
		name: addGroupMemberParams.name,
		title: event.target.value
	    })
	}
	
	return (
            <div className='new-member-input'>
		<Typography align="left" variant="h6"><strong>To Add a Member to an Existing Group:</strong></Typography>
		<Box
		    sx={{ m: 2 }}
		    component="form"
		    noValidate
		    autoComplete="off"
		>
	            <TextField InputProps={{ className: classes.input}} label="Group Name" onChange={event => changeNewMemberGroup(event)}/>
	            <TextField InputProps={{ className: classes.input}} label="New Group Member" onChange={event => changeNewMemberName(event)}/>
	            <Button 
		        variant="contained"
		        size="large"
		        onClick={() => {callEvent.addGroupMember(addGroupMemberParams.name, addGroupMemberParams.title)}}
		        disabled={addGroupMemberParams.name == '' || addGroupMemberParams.title == ''}
		    >Add Member</Button>
		</Box>
	    </div>
        );
    }


    const refreshGroupControls = (
        <CardContent className='groups-text-and-refresh'>
	    <Typography variant="h6"><strong>Groups I Belong To</strong></Typography>
	    <IconButton
	        onClick={callEvent.getUserGroupMemberships}
	        className='refresh-group-membership'
	    >
	    <RefreshIcon />
	    </IconButton>    
	</CardContent>
    )

    const refreshGroupOwnships = (
    	<CardContent className='ownships-text-and-refresh'>
	    <Typography variant="h6"><strong>Groups I Own</strong></Typography>
	    <IconButton
	        onClick={callEvent.getUserGroupOwnships}
	        className='refresh-group-ownship'
	    >
	    <RefreshIcon />
	    </IconButton>
	</CardContent>
    )
 
    const newGroupInput = () => {
        const changeNewGroupName = event => {
            setCreateGroupParams({
		title: event.target.value 
	    })
	}
	return (
            <div className='new-group-input'>
		<Typography align="left" variant="h6"><strong>To Add a New Group:</strong></Typography>
	        <Box
		    sx={{ m: 2 }}
	            component="form"
	            noValidate
	            autoComplete="off"
	        >
	            <TextField InputProps={{ className: classes.input }}
	                id="new-group-name"
	                label="New Group Name"
		        onChange={event => changeNewGroupName(event)}
	            />
	            <Button
	                variant="contained"
		        size="large"
		        onClick={() => { callEvent.createGroup(createGroupParams.title) }}
		        disabled={createGroupParams.title == ''}
	            >
	            Create Group
	            </Button>
	        </Box>
	    </div>
        );
    }

    return (
        <div class='profile-page' id='profile-page'>
	    <h1>My Profile</h1>
	    <Grid container spacing={2} sx={{mb: 2}} direction="row" justifyContent="center" alignItems="center">
	    {myProfile}
	    </Grid>
	    <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
	    <Grid item xs={3}>
	    <Card>
                {refreshGroupControls}
                {(currentGroupMemberships.success != undefined && currentGroupMemberships.success)
	            && <>
	    	        <List className='current-mems-return'>
	    	            {
    		                currentGroupMemberships.data.map((mem, i) => <ListItem><ListItemText primary={mem}/></ListItem>)
	    		    }
	    	        </List>
	    	    </>
	        }
	    </Card>
	    </Grid>
	    <Grid item xs={3}>
	    <Card>
	        {refreshGroupOwnships}
	        {(currentGroupOwnships.success != undefined && currentGroupOwnships.success)
		    && <>
	                <List className='current-owns-return'>
			    { 
			        currentGroupOwnships.data.map((own, i) => <ListItem><ListItemText primary={own}/></ListItem>)
			    }  
		        </List>
		    </>
	        }
	    </Card>
	    </Grid>
	    <Grid item xs={7} sm={7}>
	    <Card>
	        {newMemberInput()}
	        {(addMemberMessage.msg != undefined)
		    && <>
	                <InputLabel>
			    {addMemberMessage.msg}
		        </InputLabel>
		    </>
	        }
	    </Card>
	    <Card>
	        {newGroupInput()}
                {(createGroupMessage.msg != undefined)
		    && <>
		        <InputLabel>
		            {createGroupMessage.msg}
		        </InputLabel>
	            </>
	        }
	    </Card>
	    </Grid>
	    <Grid item xs={3}>
	    <Card>
	        {portfolioSelector()}
	    </Card>
	    </Grid>
	    </Grid>
	
	</div>
    )
}
