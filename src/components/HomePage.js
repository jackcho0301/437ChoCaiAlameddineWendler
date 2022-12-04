import React from 'react'
import './HomePage.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FallingCoins from './FallingCoins';

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
        <div className='home-page' style={{marginTop: '8vh'}}>
            
            <div className='home-titles'>
                <h1 className='site-title'>LORD OF STONKS</h1>
                <h3>Join an exciting stock market trading community</h3>
                <h3>Be the one who reigns over all!</h3>
                <h4>Navigate to 'My Portfolio' to start trading</h4>
            </div>
            <Container>
            <Row className='features-row'>
                <Col className='column-title'>Practice stock trading with virtual money to learn the ins and outs of the market</Col>
                <Col className='column-title'>Compete by yourself or join a group to compete with friends</Col>
                <Col className='column-title'>Rank up on the leaderboard to increase your score and earn titles</Col>
            </Row>
            </Container>
        </div>
    )
}