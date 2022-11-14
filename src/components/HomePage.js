import React from 'react'
import './HomePage.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function HomePage(props) {
    return (
        <div className='home-page' style={{marginTop: '10vh'}}>
            <div className='home-titles'>
                <h1>LORD OF STONKS</h1>
                <h3>Join an exciting stock market trading simulation community and be the one who reigns over all!</h3>
                <h4>Navigate to 'My Portfolio' to start trading</h4>
            </div>
            <Container>
            <Row>
                <Col className='column-title'>Practice stock trading with virtual money to learn the ins and outs of the market at your fingertips to help you gain confidence.</Col>
                <Col className='column-title'>Compete by yourself or join a group to compete with friends.</Col>
                <Col className='column-title'>Rank up on the leaderboard to increase your score and earn titles.</Col>
            </Row>
            </Container>
        </div>
    )
}