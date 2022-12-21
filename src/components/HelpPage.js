import React from 'react'
import './HelpPage.css'
import { Collapse } from 'antd';
import { Paper } from '@mui/material';
const { Panel } = Collapse;

export default function HelpPage(props) {
    const [openPanel, setOpenPanel] = React.useState([])
    return (
        <div id='help-page'>
            <div class="faqblock">

                <Paper sx={{
                    width: '80vw',
                    padding: '4%',
                }}>
                    <div className='container-fluid'>
                        <div className='titleHolder'>
                            <h1 style={{fontSize: '40px !important'}}>Frequently Asked Questions</h1>
                            <p></p>
                            <br/>
                            <br/>

                        </div>
                        <Collapse 
                        activeKey={openPanel} 
                        expandIconPosition='end' 
                        destroyInactivePanel={true}
                        onChange={setOpenPanel}
                        >
                            <Panel 
                            className='description-header' 
                            header="What is Lord of Stonks? How do you navigate this website?" 
                            key="1"
                            >
                                <p><b>Lord of Stonks is a website game that allows you to simulate the life of a stock trader!</b><br/>
                                    Compete to try and become the best in your quarter!<br/>
                                    Click "My Portfolio" to view your own portfolios and stock holdings, buy and sell stock shares, and choose which portfolio to compete with.<br/>
                                    Choose "Top Earners" to see the current leaderboard, search for different users scores, and see if you made it.<br/>
                                    Choose “Groups” for private groups to compete against your friends.<br/>
                                    Choose “FAQs” to see common questions and answers from users and whenever you need help.<br/>
                                    Choose your profile icon to view your profile, add groups, or see see your past performance history and and your current rank and title this quarter<br/></p>
                            </Panel>
                            <Panel className='description-header' header="How do you start playing?" key="2">
                                <p>Here is a step-by-step tutorial for the beginnings of your stock trading journey!<br/>
                                Start in the "My Portfolio" tab, each user is given a starting capital of $10,000 for each portfolio. Hit Modify Portfolio to show the buy and sell controls.<br/>
                                Enter a stock ticker in the first row (make sure to preview the buy price first!) and then hit buy, congrats on buying your first stock!<br/>
                                If you want to sell a stock enter a stock ticker in the second row, and then hit sell.<br/>
                                Use the Chart and Table buttons to toggle how you view your portfolio, and those are the basics! Keep buying, selling, and researching and climb up in the ranks.</p>
                            </Panel>
                            <Panel className='description-header' header="How is the score determined?" key="3">
                                <p>Your score is simply the total value of your preferred portfolio (which you can set on your profile page)</p>
                            </Panel>
                            <Panel className='description-header' header="What do the titles mean?" key="4">
                                <p>There are 13 titles which are based on your score. The best title you can achieve is 'Global Elite'. This
                                    title is displayed on your profile page. We do not provide a list of titles as we believe this makes the game more fun.
                                </p>
                            </Panel>
                            <Panel className='description-header' header="Does this game use real money?" key="5">
                                <p>No! Our application allows you to use fake, virtual money to simulate a stock trading environment at no cost to you.</p>
                            </Panel>
                        </Collapse>
                    </div>
                </Paper>
            </div>
        </div>
    )
}