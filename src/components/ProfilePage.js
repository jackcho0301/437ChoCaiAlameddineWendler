import React, { useEffect } from 'react'
import './ProfilePage.css'
import { EventsContext } from '../context/Events'
import { Button, IconButton, TextField, Box, InputLabel, MenuItem, FormControl, Select, Card, CardContent, Typography, Grid, Divider, List, ListItem, ListItemText } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { makeStyles, createStyles } from '@mui/styles'

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
    }, [prefPortfolio])

    useEffect(() => {
	callEvent.changePrefPortfolio(prefPortfolioParams.portID)
    }, [prefPortfolioParams])

    const renderProfile = profile => {
	return (
	    <Grid item xs={8}>
	    <Card item xs={{maxWidth: 600}}>
	    <CardContent id="profile-info-div">
		<Typography gutterBottom variant="h4"><strong>Username:</strong> {profile.username}</Typography>
		{/* <img src={profile.profilePicPath} width="100px" length="100px" /> */}
		<Typography variant="h5"><strong>Score:</strong> {profile.score}</Typography>
		<Typography variant="h5"><strong>Rank:</strong> {profile.rank}</Typography>
				
		{/* <img src="http://localhost:3000/6355a789f60cadf72eb90954.png" width="100px" length="100px" /> */}

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
