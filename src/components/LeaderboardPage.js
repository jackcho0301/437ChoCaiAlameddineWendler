import React, { useEffect } from 'react'
import './LeaderboardPage.css'
import Leaderboard from './react-leaderboard';
import LEADERS from '../config/leaders.json'
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { UserContext } from '../context/User';
import { EventsContext } from '../context/Events'

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
    const [updateLeaders, toggleUpdateLeaders] = React.useState(false)
    const [leaderboard, setLeaderboard] = React.useState(null)
    const [scoresLoaded, setScoresLoaded] = React.useState(false)

    // let leaders = LEADERS.cgally

    //query on page load
    // useEffect(() => {
    //     setLeaders(user.api('getScores'))
    // }, [])

    //query when refresh button clicked
    useEffect(() => {
        callEvent.getScores()
        setLeaderboard(newLeaderboard())
    }, [updateLeaders])

    //update scores whenever scores are changed
    useEffect(() => {
        const newScores = [...backend.allScores]
        setLeaders(newScores)
        DEBUG.allScores && console.log('all scores:', newScores)
    }, [backend.allScores])

    useEffect(() => {
        DEBUG.leaders && console.log('leaders:', leaders)
        setLeaderboard(newLeaderboard())
    }, [leaders])

    const newLeaderboard = () => {
        return (
        <>
        <Leaderboard
                className='leaderboard'
                users={leaders}
                paginate={10}
                // key={updateLeaders}
            />
        {/* <h1>{JSON.stringify(leaders)}</h1> */}
        </>
        )
    }

    DEBUG.leaders && console.log('leaderboard:', leaderboard)


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
            <Button
                variant="contained"
                onClick={() => {toggleUpdateLeaders(!updateLeaders); setScoresLoaded(true)}}
                className='refresh-scores'
            >
                QUERY
            </Button>
            {scoresLoaded ? leaderboard: 'LOADING...'}
            {/* <DataGrid
                rows={rows}
                columns={cols}
                rowsPerPageOptions={[10]}
            /> */}
        </div>
    )
}