import './App.css';
import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import PAGES from './config/pages.json'
import LoginPage from './components/LoginPage'
import LeaderboardPage from './components/LeaderboardPage'
import HomePage from './components/HomePage'
import PortfolioPage from './components/PortfolioPage'
import HelpPage from './components/HelpPage'
import LogoutPage from './components/LogoutPage'
import ProfilePage from './components/ProfilePage'
import GroupPage from './components/GroupPage'
import Swal from 'sweetalert2'
import './Swal.css'
import { UserContext } from "./context/User"
import { EventsContext } from './context/Events';
// import { login } from "./context/Events"
import { Box } from '@mui/material'

const DEBUG = {
  pageState: false,
  eventsState: true
}


function App() {
  const [pageState, setPageState] = useState(PAGES)
  const [user, modifyUser] = React.useContext(UserContext)
  const [events, callEvent] = React.useContext(EventsContext)
  const cookieExists = document.cookie.match(/^(.*;)?\s*437_auth_session\s*=\s*[^;]+(.*)?$/) != null
  console.log("cookieExists: " + cookieExists)
  useEffect(() => {
    if (cookieExists) {
      callEvent.setPersistentUser()
      modifyUser({ type: "login", value: true })
      modifyUser({ type: "username", value: events.loggedInUser })
    }
  }, [cookieExists])




  useEffect(() => {
    DEBUG.pageState && console.log("Page state:", pageState)
  }, [pageState])

  const setPageActive = pageName => {
    const newPageState = { ...pageState }
    for (const page in newPageState) {
      newPageState[page].active = false
    }
    newPageState[pageName].active = true
    setPageState(newPageState)
  }

  const setUserLoggedIn = (username, password) => {
    callEvent.login(username, password).then(res => {
      if (events.loggedInUser || res) {
        Swal.fire({
          title: 'Logged in!',
          icon: 'success',
          iconColor: 'rgb(0, 207, 0)',
          showConfirmButton: false,
          timer: 1000
        })
      }
      else {
        Swal.fire({
          title: 'Login failed!',
          icon: 'error',
          iconColor: 'rgb(255, 0, 0)',
          showConfirmButton: false,
          timer: 1000
        })
      }
    })
  }

  useEffect(() => {
    if (events.loggedInUser !== '') {
      modifyUser({ type: "login", value: true })
      modifyUser({ type: "username", value: events.loggedInUser })
    }
  }, [events.loggedInUser])

  const isCookie = cookie => {
    return document.cookie.match(`/^(.*;)?\s*${cookie}\s*=\s*[^;]+(.*)?$/`)
  }

  const pageContent = () => {
    if (document.cookie.match(`/^(.*;)?\s*437_auth_session\s*=\s*[^;]+(.*)?$/`)) {
      ; //login user automatically if already logged in. need to know how to decode cookie to do this so not sure how we can implement this functionality
    }

    if (user.loggedIn) {
      return (
        <div id='page-content'>
          <Header
            pageState={pageState}
            setPage={setPageActive} />
          {/* <Box sx={{m: 2}}/> */}
          {pageState.home.active &&
            <HomePage />}
          {pageState.portfolio.active &&
            <PortfolioPage />}
          {pageState.leaderboard.active &&
            <LeaderboardPage />}
          {pageState.help.active &&
            <HelpPage />}
          {pageState.logout.active &&
            <LogoutPage />}
          {pageState.profile.active &&
            <ProfilePage />}
          {pageState.groups.active &&
            <GroupPage />}
          {/* {pageState.ranking.active &&
            <MyRankPage />} */}

        </div>
      )
    }
    else {
      return <LoginPage setUserLoggedIn={setUserLoggedIn} cookie={cookieExists} />
    }
  }

  useEffect(() => {
    // DEBUG.eventsState && console.log("Events state:", JSON.stringify(events, 0, 2))
    DEBUG.eventsState && console.log("Backend events state:", events)
  }, [events])

  return (
    <div className="App">
      {pageContent()}
    </div>
  );
}

export default App;
