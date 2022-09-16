import './App.css';
import React, {useState, useEffect} from 'react'
import Header from './components/Header'
import PAGES from './config/pages.json'

const DEBUG = {
  pageState: false
}

function App() {
  const [pageState, setPageState] = useState(PAGES)

  useEffect(() => {
    DEBUG.pageState && console.log(pageState)
  }, [pageState])

  const setPageActive = pageName => {
    const newPageState = {...pageState}
    for(const page in newPageState) {
      newPageState[page].active = false
    }
    newPageState[pageName].active = true
    setPageState(newPageState)
  }

  return (
    <div className="App">
      <Header 
      pageState={pageState}
      setPage={setPageActive}/>
      {pageState.portfolio.active && 
      <h1>My Portfolio</h1>}
      {pageState.ranking.active && 
      <h1>My Ranking</h1>}
      {pageState.leaderboard.active && 
      <h1>Leaderboard</h1>}
    </div>
  );
}

export default App;
