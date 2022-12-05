import React from 'react'
import './HomePage.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FallingCoins from './FallingCoins';
import { Paper, Card } from '@mui/material';

export default function HomePage(props) {
    React.useEffect(() => {
        FallingCoins('body')
        return () => {
            try {
                document.getElementById('gimmick').remove()
            } catch {
                ;
            }
        }
    }, [])
    return (
        <div className='home-page' style={{ marginTop: '8vh' }}>
            <Paper sx={{
                // background: 'green', 
                width: '100%', 
                backgroundImage: 'url(https://images.megapixl.com/2509/25093013.jpg)',
                backgroundSize: 'cover',
                height: '20vw'
                }}>
            <h1 className='site-title'>LORD OF STONKS</h1>
            </Paper>
            <br/>
            <Paper sx={{
                width: '80vw',
                padding: '3%',
                // backgroundColor: 'aliceblue',
            }}>


                <div className='home-titles'>
                    <h3>Join an exciting stock market trading community and be the one who reigns over all!</h3>
                </div>
                
                <Container>
                    <Row className='features-row'>
                        <Col className='column-title'>• Practice stock trading with virtual money to learn the ins and outs of the market</Col>
                        <Col className='column-title'>• Compete by yourself or join a group to compete with friends</Col>
                        <Col className='column-title'>• Rank up on the leaderboard to increase your score and earn titles</Col>
                    </Row>
                </Container>
                <br/>
                <h1>Navigate to 'My Portfolio' to start your trading journey</h1>
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