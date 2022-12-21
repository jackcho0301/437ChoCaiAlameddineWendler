import React from 'react'
import './HomePage.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FallingCoins from './FallingCoins';
import { Paper, Card, Button } from '@mui/material';

export default function HomePage(props) {
    React.useEffect(() => {
        FallingCoins('body')
        setTimeout(() => {
            try {
                document.getElementById('gimmick').remove()
            } catch {
                ;
            }
        }, 6000)
        return () => {
            try {
                document.getElementById('gimmick').remove()
            } catch {
                ;
            }
        }
    }, [])
    return (
        <div className='home-page' style={{  }}>
            {/* <Paper sx={{
                // background: 'green', 
                width: '80vw', 
                // backgroundImage: 'url(https://images.megapixl.com/2509/25093013.jpg)',
                // backgroundSize: 'cover',
                height: '150px',
                marginTop:' 15vh',
                borderRadius: '10px'
                }}>
            <h1 className='site-title'>LORD OF STONKS</h1>
            </Paper>
            <br/> */}
            {/* <h1 className='site-title'>LORD OF STONKS</h1> */}
            <Paper sx={{
                width: '70vw',
                padding: '3%',
                borderRadius: '10px',
                marginTop: '10vh',
                
                // backgroundColor: 'aliceblue',
            }}>

                {/* <h1 style={{fontSize: '50px'}}>Lord of Stonks</h1> */}

                <div className='home-titles'>
                    <h3>Join an Exciting Trading Community</h3>
                </div>
                
                <Container>
                    <Row className='features-row'>
                        <Col className='column-title'>• Practice stock trading with virtual money to learn the ins and outs of the market</Col>
                        <Col className='column-title'>• Compete by yourself or join a group to compete with friends</Col>
                        <Col className='column-title'>• Rank up on the leaderboard to increase your score and earn titles</Col>
                    </Row>
                </Container>
                <div className='home-titles'>
                    <br></br>
                <h3 style={{fontSize: '40px'}}>Be the one who reigns over all!</h3>
                </div>

                {/* <br/> */}
                </Paper>
                <Paper sx={{
                width: '70vw',
                padding: '3%',
                borderRadius: '10px',
                marginTop: '2vh',
                
                // backgroundColor: 'aliceblue',
            }}>
                <h1 style={{marginTop: '-25px', fontSize: '45px', fontWeight: 'bold'}}>Not sure where to start?</h1>
                <h1>Navigate to 
                    <Button 
                    variant='contained'
                    className='my-portfolio-button'
                    onClick={props.goToPortfolio}
                    // color='black'
                >My Portfolio</Button>to start your trading journey</h1>
                                {/* <h1>Navigate to 
                    <Button 
                    variant='contained'
                    className='my-portfolio-button'
                    onClick={props.goToProfile}
                    // color='black'
                >Your Profile</Button>to track your progress</h1>
                                <h1>Navigate to 
                    <Button 
                    variant='contained'
                    className='my-portfolio-button'
                    onClick={props.goToFaq}
                    // color='black'
                >FAQs</Button>to answer questions you may have</h1> */}
            </Paper>
            {/*<Paper sx={{
                // background: 'green', 
                width: '100%', 
                backgroundImage: 'url(https://images.megapixl.com/2509/25093013.jpg)',
                backgroundSize: 'cover',
                height: '100px',
                position: 'absolute',
                bottom: 0,
                transform: 'scaleY(-1)'
                }}/>

                <Paper sx={{
                // background: 'green', 
                backgroundImage: 'url(https://images.megapixl.com/2509/25093013.jpg)',
                backgroundSize: 'cover',
                height: '100%',
                width: '20px',
                position: 'absolute',
                top: 0,
                left: 0,
                transform: 'rotate(270deg)'
                }}/>
                                <Paper sx={{
                // background: 'green', 
                backgroundImage: 'url(https://images.megapixl.com/2509/25093013.jpg)',
                backgroundSize: 'cover',
                height: '100%',
                position: 'absolute',
                right: 0,
                transform: 'rotate(90deg)'
                }}/>*/}
        </div>
    )
}