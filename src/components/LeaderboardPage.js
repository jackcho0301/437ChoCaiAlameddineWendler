import React, { useEffect } from 'react'
import './LeaderboardPage.css'
import Leaderboard from './react-leaderboard';
import LEADERS from '../config/leaders.json'
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { UserContext } from '../context/User';
import { EventsContext } from '../context/Events'
import RefreshIcon from '@mui/icons-material/Refresh';

const DEBUG = {
    allScores: true,
    leaders: true
}

export default function LeaderboardPage(props) {
    const [user, modifyUser] = React.useContext(UserContext)
    const [backend, callEvent] = React.useContext(EventsContext)
    const [leaders, setLeaders] = React.useState([{
        name: "Loading",
        score: 0
    }])
    const [leaderboard, setLeaderboard] = React.useState(null)
    const [scoresLoaded, setScoresLoaded] = React.useState(true)
    const [allowScoresToLoad, setAllowScoresToLoad] = React.useState(true)

    //only refreshing once right now
    const AUTO_REFRESH_MS = 30000;

    useEffect(() => {
      const interval = setInterval(() => {
        setAllowScoresToLoad(true)
        console.log('REFRESH!')
      }, AUTO_REFRESH_MS);
    
      return () => clearInterval(interval);
    }, [])

    //query when refresh button clicked
    useEffect(() => {
        if(scoresLoaded && allowScoresToLoad) {
            callEvent.getScores()
            setLeaderboard(newLeaderboard())
        }
        setAllowScoresToLoad(false)
    }, [scoresLoaded])

    //update scores whenever scores are changed
    useEffect(() => {
        const newScores = [...backend.allScores]
        setLeaders(newScores)
        DEBUG.allScores && console.log('all scores:', newScores)
        handleRefreshScores()
    }, [backend.allScores])

    useEffect(() => {
        DEBUG.leaders && console.log('leaders:', leaders)
        setLeaderboard(newLeaderboard())
    }, [leaders])

    // leaderboard component won't re-render on prop change so we need to re-render it hackily
    const newLeaderboard = () => {
        return (
            <>
                <Leaderboard
                    className='leaderboard'
                    users={leaders}
                    paginate={10}
                />
            </>
        )
    }

    // DEBUG.leaders && console.log('leaderboard:', leaderboard)

    const handleRefreshScores = () => {
        // toggleUpdateLeaders(!updateLeadersQuery);
        setScoresLoaded(false)
    }

    //toggle on and off render to get leaderboard to update
    useEffect(() => {
        if (!scoresLoaded) {
            setScoresLoaded(true)
        }
    }, [scoresLoaded])



    // leaders.sort(player => {
    //     return player.score
    // })
    // const cols = [
    //     {field: 'rank', headerName: 'Rank'},
    //     {field: 'name', headerName: 'Name'},
    //     {field: 'score', headerName: 'Score'}
    // ]
    // const rows = Object.fromEntries( leaders.map( (player, idx) => 
    //     [{rank: idx+1, name: player.name, score: player.score}]) 
    //     );

    return (
        <div id='leaderboard-page'>
            <IconButton
                variant="contained"
                onClick={() => {handleRefreshScores(); setAllowScoresToLoad(true)}}
                className='refresh-scores'
            >
                <RefreshIcon/>
            </IconButton>
            {scoresLoaded ? leaderboard : 'LOADING...'}
            {/* <DataGrid
                rows={rows}
                columns={cols}
                rowsPerPageOptions={[10]}
            /> */}
        </div>
    )
}