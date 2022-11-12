import React, { useEffect } from 'react'
import './HelpPage.css'
import { EventsContext } from '../context/Events'


export default function LogoutPage(props) {


    const [backend, callEvent] = React.useContext(EventsContext)


    useEffect(() => {
        callEvent.logout()
    }, [])
    

    return (
        <div id='logout-page'>
            <p>hello</p>
        </div>
    )
}