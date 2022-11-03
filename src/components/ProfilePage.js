import React, { useEffect } from 'react'
import './ProfilePage.css'
import { EventsContext } from '../context/Events'
import { Button, IconButton, TextField, Box } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

export default function ProfilePage(props) {
    const [backend, callEvent] = React.useContext(EventsContext)
    const [currentGroupMemberships, setCurrentGroupMemberships] = React.useState([{}])

    useEffect(() => {
	setCurrentGroupMemberships(backend.groupMemberships)
    }, [backend.groupMemberships])

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
	</div>
    )
}
