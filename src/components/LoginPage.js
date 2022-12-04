import React, { useState, useEffect } from 'react'
import { TextField, Button, FormControl, Divider, Grid, Box, rgbToHex } from '@mui/material'
import './LoginPage.css'
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Swal from 'sweetalert2'
import { EventsContext } from '../context/Events'
import PasswordChecklist from "react-password-checklist"


const DEBUG = {
    username: true,
    loggedIn: true
}


export default function LoginPage(props) {
    const [isRegisterSelected, setRegisterSelected] = useState(false)
    const [credentials, setCredentials] = React.useState({
        username: '',
        password: ''
    })
    const [passwordVerify, setPasswordVerify] = React.useState('')
    const [events, callEvent] = React.useContext(EventsContext)


    const isRegistrationValid = () => {
        const conditions = [
            credentials.password == passwordVerify,
            credentials.password.length >= 6,
            credentials.username.length >= 3
        ]
        return conditions.every(x => x)
    }

    const setLoggedIn = () => {
        DEBUG.loggedIn && console.log('credentials: ', credentials)
	props.setUserLoggedIn(credentials.username, credentials.password)
    }

    const registerUser = () => {
        if (isRegistrationValid()) {
            callEvent.register(credentials.username, credentials.password)
            Swal.fire({
                title: 'Registration Successful!',
                icon: 'success',
                iconColor: 'rgb(0, 207, 0)',
                showConfirmButton: false,
                showCloseButton: true,
                timer: 1000
            })
        }
        else {
            Swal.fire({
                // title: '<h1 style="color: red">Passwords do not match</h1>',
                title: 'Registration Invalid',
                text: 'Please try again',
                icon: 'error',
                timer: 2000
            })
        }
    }

    const setUsername = event => {
        DEBUG.username && console.log('username:', event.target.value)
        setCredentials({
            username: event.target.value,
            password: credentials.password
        })
    }

    const setPassword = event => {
        setCredentials({
            username: credentials.username,
            password: event.target.value
        })
    }


    return (
        <div id='login-page'>
            <h1 className='login-title'>Lord of Stonks</h1>
            <div id='login-page-form-div'>
                <Grid
                    container
                    alignItems='center'
                    justifyContent='center'
                >
                    <Box
                        sx={{
                            borderRadius: 1,
                            bgcolor: 'text.disabled',
                        }}
                    >
                        <div id='sign-in-or-register-div'>
                            <Button
                                variant='contained'
                                style={{  // TODO: refactor to makestyles
                                    backgroundColor: isRegisterSelected ? 'rgb(245,245,245)' : 'black',
                                    color: isRegisterSelected ? 'black' : 'white'
                                }}
                                onClick={() => setRegisterSelected(false)}
                            >
                                Sign in
                            </Button>
                            <Divider
                                orientation='vertical'
                                className='sign-in-register-divider'
                                flexItem
                            />
                            <Button
                                variant='contained'
                                style={{
                                    backgroundColor: isRegisterSelected ? 'black' : 'rgb(245,245,245)',
                                    color: isRegisterSelected ? 'white' : 'black'
                                }}
                                onClick={() => setRegisterSelected(true)}
                            >
                                Register
                            </Button>
                        </div>
                    </Box>
                </Grid>
                <Box sx={{ m: 1 }} />
                <FormControl id='login-form-control'>
                    <div id='login-textfields'>
                        <TextField
                            className='login-text'
                            placeholder="Username"
                            required
                            size='small'
                            variant='outlined'
                            onChange={event => setUsername(event)}
                        />
                        <TextField
                            className='login-text'
                            placeholder="Password"
                            type="password"
                            required
                            size='small'
                            variant='outlined'
                            onChange={event => setPassword(event)}
                        />
                        {isRegisterSelected &&
                            <React.Fragment>
                                <TextField
                                    className='login-text'
                                    placeholder="Verify Password"
                                    type="password"
                                    required
                                    size='small'
                                    variant='outlined'
                                    onChange={event => setPasswordVerify(event.target.value)}
                                />

                                <PasswordChecklist
                                    rules={["minLength"]}
                                    minLength={3}
                                    value={credentials.username}
                                    onChange={(isValid) => { }}
                                    messages={{
                                        minLength: "Username must have at least 3 characters",
                                    }}
                                />
                                <PasswordChecklist
                                    rules={["minLength", "match"]}
                                    minLength={6}
                                    value={credentials.password}
                                    valueAgain={passwordVerify}
                                    onChange={(isValid) => { }}
                                    messages={{
                                        minLength: "Password must have at least 6 characters",
                                        match: "Passwords must match"
                                    }}
                                />
                            </React.Fragment>

                        }

                    </div>
                    {/* <div id='login-chart-icon-container'>
                            <ShowChartIcon style={{ fill: 'green', fontSize: '4vw' }} />
                        </div> */}

                </FormControl>
                <Box sx={{ m: 1 }} />
                <Button
                    variant='contained'
                    onClick={!isRegisterSelected ? setLoggedIn : registerUser}
                >
                    {!isRegisterSelected ? 'Sign In' : 'Register'}
                </Button>
                {isRegisterSelected ||
                    <a id='forgot-password'>Forgot Password?</a>}
            </div>
        </div>
    )
}
