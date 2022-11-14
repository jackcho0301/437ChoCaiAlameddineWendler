import React from 'react'
import './HelpPage.css'
import { Collapse } from 'antd';
const { Panel } = Collapse;

export default function HelpPage(props) {
    return (
        <div id='help-page'>
            <div class="faqblock">
                <div className='container-fluid'>
                    <div className='titleHolder'>
                        <h1>Frequently Asked Questions</h1>
                        <p></p>
                    </div>
                    <Collapse defaultActiveKey={['1']} onChange={() => {}}>
                        <Panel className='description-header' header="What is Lord of Stonks? How do you navigate this website?" key="1">
                            <p>Lord of Stonks is a website game that allows you to simulate the life of a stock trader!
                                Compete to try and become the best in your quarter!
                                Click "My Portfolio" to view your own portfolios and stock holdings, buy and sell stock shares, and choose which portfolio to compete with.
                                Choose "My Ranking" to see your past performance history and your current rank and title this quarter.
                                Choose "Top Earners" to see the current leaderboard, search for different users scores, and see if you made it.
                                Choose “FAQs” to see common questions and answers from users and whenever you need help.
                                Choose your profile icon to see your profile and edit your current information.</p>
                        </Panel>
                        <Panel className='description-header' header="How is the score determined?" key="2">
                            <p>Our application calculates your score based on the ROI of your portfolio.</p>
                        </Panel>
                        <Panel className='description-header' header="What do the titles mean?" key="3">
                            <p>At the end of a season if your ranking is high enough on the leaderboard you will be awarded a corresponding title for your rank. The current #1 title is 'Global Elite'. This 
                                title can be displayed on your "My Ranking" page.
                            </p>
                        </Panel>
                        <Panel className='description-header' header="Does this game use real money?" key="4">
                            <p>No! Our application allows you to use fake, virtual money to simulate a stock trading environment with no cost to you.</p>
                        </Panel>
                    </Collapse>
                </div>
                {/* <div className='support'>
                    <h3>Contact for Questions</h3>
                    <p></p>
                </div> */}
            </div>
        </div>
    )
}