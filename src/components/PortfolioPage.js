// import React, { useEffect } from 'react'
// import './PortfolioPage.css'
// import { EventsContext } from '../context/Events'
// import { Button } from '@mui/material'

// export default function PortfolioPage(props) {
//     const [user, modifyUser] = React.useContext(UserContext)
//     const events = React.useContext(EventsContext)

//     // useEffect(() => {
//     //     modifyUser({type: "portfolio", value: getPortfolio())
//     // }, [])

//     useEffect(() => {
//         console.log('Current portfolio:', currentPortfolio)
//     }, [currentPortfolio])


//     return (
//         <div className='portfolio-page'>
//             {/* <div class='trim'><img src='./images/Portfolio Page.png' /></div> */}
//             <h1>Current Portfolio</h1>
//             <p>{JSON.stringify(currentPortfolio, null, 2)}</p>

//             <Button variant='contained' onClick={addDollars}>Add Dollars</Button>
//             <Button variant='contained' onClick={getPortfolio}>Current</Button>
//             <Button variant='contained'onClick={buyStock}>Buy</Button>
//             <Button variant='contained' onClick={sellStock}>Sell</Button>


//         </div>
//     )
// }