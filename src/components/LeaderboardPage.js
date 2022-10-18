import React from 'react'
import './LeaderboardPage.css'
import Leaderboard from './react-leaderboard';
import LEADERS from '../config/leaders.json'
import { DataGrid } from '@mui/x-data-grid';


export default function LeaderboardPage(props) {
    let leaders = LEADERS.cgally
    leaders.sort(player => {
        return player.score
    })
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
            <Leaderboard 
                className='leaderboard'
                users={leaders} 
                paginate={10}
            />
            {/* <DataGrid
                rows={rows}
                columns={cols}
                rowsPerPageOptions={[10]}
            /> */}
        </div>
    )
}