import './App.css';
import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import PAGES from './config/pages.json'
import LoginPage from './components/LoginPage'
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
          {pageState.home.active &&
            <h1>Home</h1>}
          {pageState.portfolio.active &&
            <h1>My Portfolio</h1>}
          {pageState.ranking.active &&
            <h1>My Ranking</h1>}
          {pageState.leaderboard.active &&
            <h1>Leaderboard</h1>}
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
