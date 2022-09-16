import React from 'react'
import { AppBar, IconButton, Avatar } from '@mui/material'
import HeaderItem from './HeaderItem'
import './Header.css'

export default function Header(props) {

    return (
        <div id='header-div'>
            <AppBar
                position='static'
                sx={{ bgcolor: "black" }}
            >
                <div id='header-contents'>
                    <div id='menu-wrapper'>
                        {Object.keys(props.pageState).map((page, idx) => {
                            return (
                                <HeaderItem
                                    setPage={() => props.setPage(page)}
                                    key={idx}
                                    text={props.pageState[page].text}
                                />)
                        })}
                    </div>

                    <div id='icon-wrapper'>
                        <IconButton>
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