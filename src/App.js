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

const DEBUG = {
  pageState: false
}

function App() {
  const [pageState, setPageState] = useState(PAGES)
  const [loggedIn, setLoggedIn] = useState(false) //TODO: convert this to usercontext!

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

  const setUserLoggedIn = () => {
    setLoggedIn(true)
    Swal.fire({
      title: 'Logged in!',
      icon: 'success',
      iconColor: 'rgb(0, 207, 0)',
      showConfirmButton: false,
      timer: 1000
    })
  }

  const pageContent = () => {
    if (loggedIn) {
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
      return <LoginPage setLoggedIn={setUserLoggedIn} />
    }
  }

  return (
    <div className="App">
      {pageContent()}
    </div>
  );
}

export default App;
