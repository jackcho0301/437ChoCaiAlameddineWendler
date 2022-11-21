import React, { useEffect } from 'react'
import './ProfilePage.css'
import { EventsContext } from '../context/Events'
import { Button, IconButton, TextField, Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

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
	    <div id="profile-info-div">
		<p><strong>Username:</strong> {profile.username}</p>
		<img src={profile.profilePicPath} width="100px" length="100px" />
		<p><strong>Score:</strong> {profile.score}</p>
		<p><strong>Rank:</strong> {profile.rank}</p>
				
		{/* <img src="http://localhost:3000/6355a789f60cadf72eb90954.png" width="100px" length="100px" /> */}

	    </div>

	)
    }

    const portfolioSelector = () => {
        const changePortfolioID = event => {
	    setPrefPortfolioParams({portID: event.target.value})
	}

	return (
	    <div className='new-pref-port-select'>
                <h2>Preferred Portfolio:</h2>
                <p>{prefPortfolio}</p>
		<Box>
		    <FormControl sx={{m:1, minWidth:180}}>
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
	    </div>
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
		<Box
		    component="form"
		    noValidate
		    autoComplete="off"
		>
	            <TextField label="Group Name" variant="filled" onChange={event => changeNewMemberGroup(event)}/>
	            <TextField label="New Group Member" variant="filled" onChange={event => changeNewMemberName(event)}/>
	            <Button 
		        variant="contained"
		        onClick={() => {callEvent.addGroupMember(addGroupMemberParams.name, addGroupMemberParams.title)}}
		        disabled={addGroupMemberParams.name == '' || addGroupMemberParams.title == ''}
		    >Add Member</Button>
		</Box>
	    </div>
        );
    }


    const refreshGroupControls = (
        <div className='groups-text-and-refresh'>
	    <h1>Groups I Belong To</h1>
	    <IconButton
	        onClick={callEvent.getUserGroupMemberships}
	        className='refresh-group-membership'
	    >
	    <RefreshIcon fontSize='large' />
	    </IconButton>    
	</div>
    )

    const refreshGroupOwnships = (
    	<div className='ownships-text-and-refresh'>
	    <h1>Groups I Own</h1>
	    <IconButton
	        onClick={callEvent.getUserGroupOwnships}
	        className='refresh-group-ownship'
	    >
	    <RefreshIcon fontSize='large' />
	    </IconButton>
	</div>
    )
 
    const newGroupInput = () => {
        const changeNewGroupName = event => {
            setCreateGroupParams({
		title: event.target.value 
	    })
	}
	return (
            <div className='new-group-input'>
	        <Box
	            component="form"
	            noValidate
	            autoComplete="off"
	        >
	            <TextField
	                id="new-group-name"
	                label="New Group Name"
	                variant="filled"
		        onChange={event => changeNewGroupName(event)}
	            />
	            <Button
	                variant="contained"
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

			{myProfile}

            {refreshGroupControls}
            {(currentGroupMemberships.success != undefined && currentGroupMemberships.success)
	        && <>
	    	    <div className='current-mems-return'>
	    	        <ul>
	    		    {
	    		        currentGroupMemberships.data.map((mem, i) => <li>{mem}</li>)
	    		    }
	    		</ul>
	    	    </div>
	    	</>
	    }
	    {refreshGroupOwnships}
	    {(currentGroupOwnships.success != undefined && currentGroupOwnships.success)
		&& <>
	            <div className='current-owns-return'>
			<ul>
			    { 
			        currentGroupOwnships.data.map((own, i) => <li>{own}</li>)
			    }  
		        </ul>
		    </div>
		</>
	    }
	    {newMemberInput()}
	    {(addMemberMessage.msg != undefined)
		&& <>
	            <InputLabel>
			{addMemberMessage.msg}
		    </InputLabel>
		</>
	    }
	    {newGroupInput()}
            {(createGroupMessage.msg != undefined)
		&& <>
		    <InputLabel>
		        {createGroupMessage.msg}
		    </InputLabel>
	        </>
	    }
	    {portfolioSelector()}
	
	</div>
    )
}
