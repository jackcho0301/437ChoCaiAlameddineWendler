import React, { useEffect } from 'react'
import './MyRankPage.css'
import { EventsContext } from '../context/Events'

export default function MyRankPage(props) {
    const [backend, callEvent] = React.useContext(EventsContext)
    const [scoresLoaded, setScoresLoaded] = React.useState(true)
    const [titleLoaded, setTitleLoaded] = React.useState(true)
    const [statsLoaded, setStatsLoaded] = React.useState(true)
    const [currentRankings, setCurrentRankings] = React.useState([{}])
    const [currentTitle, setCurrentTitle] = React.useState([{}])
    const [currentStats, setCurrentStats] = React.useState([{}])
    const [rankNumber, setRankNumber] = React.useState(0)
    const [rankTotal, setRankTotal] = React.useState(0)
    const [rankTitle, setRankTitle] = React.useState('')
    const [rankStats, setRankStats] = React.useState([{}])

    useEffect(() => {
	if (scoresLoaded) {
	    setCurrentRankings(callEvent.getScores())
	}
    }, [scoresLoaded])

    useEffect(() => {
	if (titleLoaded) {
	    setCurrentTitle(callEvent.getTitle())
	}
    }, [titleLoaded])

    useEffect(() => {
	if (statsLoaded) {
	    setCurrentStats(callEvent.getStats())
	}
    }, [statsLoaded])

    useEffect(() => {
	if (!scoresLoaded) {
	    setScoresLoaded(true)
        }
    }, [scoresLoaded])

    useEffect(() => {
        if (!titleLoaded) {
	    setTitleLoaded(true)
	}
    }, [titleLoaded])

    useEffect(() => {
	if (!statsLoaded) {
	    setStatsLoaded(true)
	}
    }, [statsLoaded])

    useEffect(() => {
	if (backend.currentTitle.data != undefined) {
	    setRankTotal(backend.allScores.length + 1)
	    const isUser = (element) => element.name == backend.currentTitle.data.user
	    const currentUserIndex = backend.allScores.findIndex(isUser)
	    setRankNumber(currentUserIndex + 1)
	    if (backend.allScores.length > 1) {
	        if (Number(backend.allScores[currentUserIndex].score) < 10000) {
	            setRankTitle('Trader Who Can\'t Even')
	        }
	        else if (Number(backend.allScores[currentUserIndex].score) > 1000000) {
		    setRankTitle('Global Elite')
	        }
	        else {
		    setRankTitle('Unpaid Stock Analyst Intern')
	        }
	    }
	}
	if (backend.currentStats.success) {
	    setRankStats(backend.currentStats.data)
	}
    }, [backend.allScores, backend.currentTitle, backend.currentStats])

    return (
        <div class='my-rank-page' id='my-rank-page'>
	    <header></header>
            <h2>Your Current Quarter Rank is:</h2>
	    {(rankNumber != 0 && rankTotal != 0)
	        && <>
		    <h1>{rankNumber} out of {rankTotal}</h1>
		</>
	    }
	    <h2>Your Lifetime Rank History is:</h2>
		<h1>
            {(rankStats.length > 1)
	        && <>
		    {
		       rankStats.map((stat, i) => <p>{(new Date(stat.quarterEnd)).toLocaleDateString()} &#36;{stat.finalValue}</p>)
		    }		    
	        </>
            }
			</h1>
	    <h2>Your Current Title is:</h2>
	    {(rankTitle != '')
		&& <>
		    <h1>{rankTitle}</h1>
                </>
	    }
        </div>
    )
}
