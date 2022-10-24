import './App.css';
import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import PAGES from './config/pages.json'
import LoginPage from './components/LoginPage'
import LeaderboardPage from './components/LeaderboardPage'
import HomePage from './components/HomePage'
import MyRankPage from './components/MyRankPage'
import PortfolioPage from './components/PortfolioPage'
import HelpPage from './components/HelpPage'
import Swal from 'sweetalert2'
import './Swal.css'
import { UserContext } from "./context/User"
import { EventsContext } from './context/Events';
// import { login } from "./context/Events"

const DEBUG = {
  pageState: false,
  eventsState: true
}



function App() {
  const [pageState, setPageState] = useState(PAGES)
  const [user, modifyUser] = React.useContext(UserContext)
  const [events, callEvent] = React.useContext(EventsContext)



  useEffect(() => {
    DEBUG.pageState && console.log(pageState)
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
    modifyUser({type: "login", value: true})
    modifyUser({type: "username", value: username})
    // user.api('login', [username, password])
    callEvent.login(username, password)
  }

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
          <div className='divide-10'/>
          {pageState.home.active &&
            <HomePage/>}
          {pageState.portfolio.active &&
            <PortfolioPage/>}
          {pageState.ranking.active &&
            <MyRankPage/>}
          {pageState.leaderboard.active &&
            <LeaderboardPage/>}
          {pageState.help.active &&
            <HelpPage/>}

        </div>
      )
    }
    else {
      return <LoginPage setUserLoggedIn={setUserLoggedIn}/>
    }
  }

  useEffect(() => {
    // DEBUG.eventsState && console.log("Events state:", JSON.stringify(events, 0, 2))
    DEBUG.eventsState && console.log("Events state:", events)
  }, [events])

  return (
    <div className="App">
      {pageContent()}
    </div>
  );
}

export default App;
