import React, { useState } from 'react'
import { TextField, Button, FormControl, Divider, Grid, Box } from '@mui/material'
import './LoginPage.css'
import ShowChartIcon from '@mui/icons-material/ShowChart';

export default function LoginPage(props) {
    const [isRegisterSelected, setRegisterSelected] = useState(false)

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
                            />
                            <TextField
                                className='login-text'
                                placeholder="Password"
                                type="password"
                                required
                                size='small'
                                variant='outlined' />
                            {isRegisterSelected &&
                                <TextField
                                    className='login-text'
                                    placeholder="Verify Password"
                                    type="password"
                                    required
                                    size='small'
                                    variant='outlined' />}

                        </div>
                        {/* <div id='login-chart-icon-container'>
                            <ShowChartIcon style={{ fill: 'green', fontSize: '4vw' }} />
                        </div> */}

                    </FormControl>
                <Box sx={{ m: 1 }} />
                <Button
                    variant='contained'
                    onClick={props.setLoggedIn}
                >
                    {!isRegisterSelected ? 'Sign In' : 'Register'}
                </Button>
                {isRegisterSelected ||
                <a href='' id='forgot-password'>Forgot Password?</a>}
            </div>
        </div>
    )
}