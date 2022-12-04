import React from 'react'
import { AppBar, IconButton, Avatar } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import HeaderItem from './HeaderItem'
import './Header.css'

export default function Header(props) {
    const homeButton = (
    <IconButton
        id='home-button'
        onClick={() => props.setPage('home')}
    >
        <HomeIcon/>
    </IconButton>
    )

    return (
        <div id='header-div'>
            <AppBar
                position='static'
                // sx={{ bgcolor: "black" }}
            >
                <div id='header-contents'>
                    <div id='menu-wrapper'>
                        {Object.keys(props.pageState).map((page, idx) => {
                            const text = props.pageState[page].text
                            const disabled = props.pageState[page].disabled
                            if (text == "Profile" || text == "Log Out")
                            {
                                // Do Nothing
                            }
                            else if(text) {
                                return (
                                    <HeaderItem
                                        setPage={() => props.setPage(page)}
                                        key={idx}
                                        text={text}
                                        disabled={disabled}
                                    />)
                            } else {
                            return (
                                <HeaderItem
                                    setPage={() => props.setPage('home')}
                                    key={idx}
                                    content={homeButton}
                                />)
                            }
                        })}
                    </div>

                    <div id='logout-wrapper'>
                        <p id="logout-btn" onClick={() => props.setPage("logout")}>
                            <strong>Log Out</strong>
                        </p>
                    </div>

                    <div id='icon-wrapper'>
                        <IconButton onClick={() => props.setPage("profile")}>
                            <Avatar
                                src='/images/stonks.png'
                                alt='profile-avatar'
                                id='header-profile-avatar'
                            />
                        </IconButton>
                    </div>
                </div>
            </AppBar>
        </div>
    )
}
