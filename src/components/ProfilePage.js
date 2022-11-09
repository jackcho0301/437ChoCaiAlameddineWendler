import React, { useEffect } from 'react'
import './ProfilePage.css'
import { EventsContext } from '../context/Events'
import { Button, IconButton, TextField, Box, InputLabel } from '@mui/material'
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
	}, [])

	const renderProfile = profile => {
		return (
			<>
				<p>Username: {profile.username}</p>
				<p>Score: {profile.score}</p>
				<p>Rank: {profile.rank}</p>
				{/* <img src="/profilePicture/6355a789f60cadf72eb90954.png" width="100px" length="100px" /> */}
				<img src="http://localhost:3000/6355a789f60cadf72eb90954.png" width="100px" length="100px" />

			</>

		)
	}





    // useEffect(() => {
    //     console.log('Current returns portfolio:', myProfile)
    // }, [myProfile])




	// const refreshMyProfile = (
    // 	<div className='my-profile'>
	//     <h1>My Profile</h1>
	// 	{console.log(myProfile.score)}
	//     <IconButton
	//         onClick={callEvent.getMyProfile}
	//         className='refresh-get-my-profile'
	//     >
	//     <RefreshIcon fontSize='large' />
	//     </IconButton>
	// </div>
    // )






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
		    >Add Member</Button>
		</Box>
	    </div>
        );
    }


    const refreshGroupControls = (
        <div className='groups-text-and-refresh'>
	    <h1>Groups I Belong To</h1>
	    <IconButton
	        onClick={callEvent.getMyProfileResponse}
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
        <div id='profile-page'>
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
	    {(addMemberMessage.msg != undefined && addMemberMessage.success)
		&& <>
	            <InputLabel>
			{addMemberMessage.msg}
		    </InputLabel>
		</>
	    }
	    {newGroupInput()}
            {(createGroupMessage.msg != undefined && createGroupMessage.success)
		&& <>
		    <InputLabel>
		        {createGroupMessage.msg}
		    </InputLabel>
	        </>
	    }

		{/* {refreshMyProfile} */}

		{myProfile}



	</div>
    )
}
