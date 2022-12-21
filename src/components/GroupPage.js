import React, { useEffect } from 'react'
import './ProfilePage.css'
import './GroupPage.css'
// import './MyRankPage.css'
import { EventsContext } from '../context/Events'
import { Button, IconButton, TextField, Box, InputLabel, MenuItem, FormControl, Select, Card, CardContent, Typography, Grid, Divider, List, ListItem, ListItemText, Modal, Paper, Dialog, Popover } from '@mui/material'
import { LineChart, ResponsiveContainer, Legend, Tooltip, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import RefreshIcon from '@mui/icons-material/Refresh'
import { makeStyles, createStyles } from '@mui/styles'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { green, amber } from '@mui/material/colors'
import Swal from 'sweetalert2'

export default function GroupPage(props) {
	const [backend, callEvent] = React.useContext(EventsContext)
	const [currentGroupMemberships, setCurrentGroupMemberships] = React.useState([{}])
	const [currentGroupOwnships, setCurrentGroupOwnships] = React.useState([{}])
	const [createGroupParams, setCreateGroupParams] = React.useState({
		title: ''
	})
	const [createGroupMessage, setCreateGroupMessage] = React.useState([{}])
	const [addGroupMemberParams, setAddGroupMemberParams] = React.useState({
		name: '',
		title: ''
	})
	const [addMemberMessage, setAddMemberMessage] = React.useState([{}])

	const [myProfile, setMyProfile] = React.useState(<></>)
	const [prefPortfolio, setPrefPortfolio] = React.useState(0)
	const [prefPortfolioParams, setPrefPortfolioParams] = React.useState({
		portID: ''
	})

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

	const [groupsChanged, setGroupsChanged] = React.useState(false)

	const [newGroupModalOpen, setNewGroupModalOpen] = React.useState(false)
	const [newMemberModalOpen, setNewMemberModalOpen] = React.useState(false)


	const useStyles = makeStyles((theme) =>
		createStyles({
			input: {
				height: 43
			},
			popoverRoot: {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			},
		})
	)

	const classes = useStyles()

	useEffect(() => {
		callEvent.getUserGroupMemberships()
		callEvent.getUserGroupOwnships()
	}, [groupsChanged, backend.createGroupResponse, backend.addMemberResponse])

	useEffect(() => {
		setCurrentGroupMemberships(backend.groupMemberships)
	}, [backend.groupMemberships])

	useEffect(() => {
		setCurrentGroupOwnships(backend.groupOwnships)
	}, [backend.groupOwnships])

	useEffect(() => {
		setCreateGroupMessage(backend.createGroupResponse)
	}, [backend.createGroupResponse])

	useEffect(() => {
		setAddMemberMessage(backend.addMemberResponse)
	}, [backend.addMemberResponse])

	useEffect(() => {
		console.log("!!" + JSON.stringify(backend.profile))
		setMyProfile(renderProfile(backend.profile))
	}, [backend.profile])

	useEffect(() => {
		callEvent.getMyProfile()
		callEvent.getPrefPortfolio()
	}, [])

	useEffect(() => {
		setPrefPortfolio(backend.prefPortNumber)
	}, [backend.prefPortNumber])

	useEffect(() => {
		callEvent.getMyProfile()
		callEvent.getPrefPortfolio()
		callEvent.getScores()
		callEvent.getTitle()
	}, [prefPortfolio])

	useEffect(() => {
		callEvent.changePrefPortfolio(prefPortfolioParams.portID)
	}, [prefPortfolioParams])

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
			setRankTotal(backend.allScores.length)
			const isUser = (element) => element.name == backend.currentTitle.data.user
			const currentUserIndex = backend.allScores.findIndex(isUser)
			setRankNumber(currentUserIndex + 1)
			if (backend.allScores.length > 1) {
				setRankTitle(calculateTitle(Number(backend.allScores[currentUserIndex].score)))
			}
		}
		if (backend.currentStats.success) {
			setRankStats(backend.currentStats.data)
		}
	}, [backend.allScores, backend.currentTitle, backend.currentStats])

	function calculateTitle(score) {
		if (score <= 0) {
			return 'Trader Who Can\'t Even';
		}
		else if (score < 5000) {
			return 'Jim Cramer Acolyte';
		}
		else if (score < 10000) {
			return 'Crypto Zealot';
		}
		else if (score < 11000) {
			return 'Unpaid Stock Analyst Intern';
		}
		else if (score < 12500) {
			return 'Envy of the Break Room';
		}
		else if (score < 15000) {
			return 'Sure Bet Trader';
		}
		else if (score < 17500) {
			return 'European Vacationeer';
		}
		else if (score < 20000) {
			return 'Knowledgeable Broker';
		}
		else if (score < 25000) {
			return 'Brokerage Firm Star';
		}
		else if (score < 50000) {
			return 'Warren Buffet\'s Idol';
		}
		else if (score < 100000) {
			return 'Wolf of Wall Street';
		}
		else if (score < 500000) {
			return 'Congressional Trade \'Consultant\'';
		}
		else if (score >= 1000000) {
			return 'Global Elite'
		}
	}

	function formatStatDate(crudeDate) {
		const FIR_QUART_NUM = "3/31"
		const FIR_QUART_STR = "1st Quarter, "
		const SEC_QUART_NUM = "6/30"
		const SEC_QUART_STR = "2nd Quarter, "
		const THR_QUART_NUM = "9/30"
		const THR_QUART_STR = "3rd Quarter, "
		const FOU_QUART_NUM = "12/31"
		const FOU_QUART_STR = "4th Quarter, "

		const primaryString = (new Date(crudeDate)).toLocaleDateString()
		let retString = ""
		if (primaryString.includes(FIR_QUART_NUM)) {
			retString = FIR_QUART_STR + primaryString.slice(-4)
		}
		else if (primaryString.includes(SEC_QUART_NUM)) {
			retString = SEC_QUART_STR + primaryString.slice(-4)
		}
		else if (primaryString.includes(THR_QUART_NUM)) {
			retString = THR_QUART_STR + primaryString.slice(-4)
		}
		else {
			// We can do this because all date entries are already 
			// filtered to only be the end of quarters.
			retString = FOU_QUART_STR + primaryString.slice(-4)
		}

		return retString
	}

	const renderProfile = profile => {
		return (
			// <Grid item xs={8}>
			// 	<Card item xs={{ maxWidth: 600 }}>
			// 		<CardContent id="profile-info-div">
			// 			<AutoAwesomeIcon fontSize="large" sx={{ color: amber[400] }} />
			// 			<Typography sx={{ textTransform: 'capitalize' }} gutterBottom variant="h3"><strong>{profile.username}</strong> </Typography>
			// 			<img src={profile.profilePicPath} width="100px" length="100px" />
			// 			<Box display="flex" fullWidth="true">
			// 				<AutoAwesomeIcon fontSize="large" sx={{ color: amber[400] }} />
			// 				<Typography sx={{ flexGrow: 1, }} variant="h4"><strong><span className='green'>{rankNumber}</span> out of {rankTotal}</strong></Typography>
			// 				<AutoAwesomeIcon fontSize="large" sx={{ color: amber[400] }} />
			// 			</Box>

			// 			<Typography variant="h5" sx={{ marginTop: '10px' }}><strong>Score: <span className='emphasis'>{Math.round(profile.score)}</span></strong></Typography>
			// 			{/* <Typography variant="h5"><strong>Rank:</strong> {profile.rank} out of {profile.rankTotal}</Typography> */}
			// 			<Typography variant="h5">
			// 				<strong>Title:
			// 					<span className='emphasis'>
			// 						{(rankTitle != '')
			// 							&& <>
			// 								<AttachMoneyIcon fontSize="small" sx={{ color: green[800] }} />
			// 								<span /*style={{color: 'green'}}*/><strong>{rankTitle}</strong></span>
			// 								<AttachMoneyIcon fontSize="small" sx={{ color: green[800] }} />
			// 							</>

			// 						}
			// 					</span></strong>
			// 			</Typography>
			// 			<br />

			// 			{/* <img src="http://localhost:3000/6355a789f60cadf72eb90954.png" width="100px" length="100px" /> */}
			// 			<Typography variant="h5"><strong>Your Lifetime Rank History is:</strong></Typography>
			// 			{(rankStats.length > 1)
			// 				&& <>
			// 					<ResponsiveContainer width="100%" aspect={3}>
			// 						<LineChart data={rankStats.map(stat => ({ quarterEnd: formatStatDate(stat.quarterEnd), finalValue: stat.finalValue }))} margin={{ right: 30, left: 30 }}>
			// 							<XAxis dataKey="quarterEnd" interval={"preserveStartEnd"} />
			// 							<YAxis></YAxis>
			// 							<Line isAnimationActive={false} dataKey="finalValue" stroke="black" dot={{ stroke: "darkblue", strokeWidth: 2, r: 10 }} />
			// 						</LineChart>
			// 					</ResponsiveContainer>
			// 				</>
			// 			}
			// 			{(rankStats.length === 0)
			// 				&& <>
			// 					<Typography variant="subtitle1">No lifetime stats are available for this user. Check at the end of the quarter!</Typography>
			// 				</>
			// 			}
			// 			<AutoAwesomeIcon fontSize="large" sx={{ color: amber[400] }} />
			// 			{portfolioSelector()}
			// 		</CardContent>
			// 	</Card>
			// </Grid>
			<Grid container spacing={5} direction="row" justifyContent="center" alignItems="center">
				<Grid item xs={3}>
					<Card item sx={{ backgroundColor: 'rgb(220,240,220)' }}>
						<center>{refreshGroupControls}</center>
						{(currentGroupMemberships.success != undefined && currentGroupMemberships.success)
							&& <>
								<List sx={{ listStyleType: 'disc', pl: 4 }} className='current-mems-return'>
									{
										currentGroupMemberships.data.map((mem, i) => <ListItem sx={{ display: 'list-item' }}><ListItemText primary={mem} /></ListItem>)
									}
								</List>
							</>
						}
					</Card>
				</Grid>
				<Grid item xs={3}>
					<Card item sx={{ backgroundColor: 'rgb(220,240,220)' }}>
						<center>{refreshGroupOwnships}</center>
						{(currentGroupOwnships.success != undefined && currentGroupOwnships.success)
							&& <>
								<List sx={{ listStyleType: 'disc', pl: 4 }} className='current-owns-return'>
									{
										currentGroupOwnships.data.map((own, i) => <ListItem sx={{ display: 'list-item' }}><ListItemText primary={own} /></ListItem>)
									}
								</List>
							</>
						}
					</Card>
				</Grid>
				<Grid item xs={7} sm={7}>

					<Card item sx={{ backgroundColor: 'rgb(220,240,220)' }}>
						{newGroupInput()}
						{(createGroupMessage.msg != undefined)
							&& <>
								<InputLabel>
									{createGroupMessage.msg}
								</InputLabel>
							</>
						}
					</Card>
				</Grid>
				<Grid item xs={7} sm={7}>
					<Card item sx={{ backgroundColor: 'rgb(220,240,220)' }}>
						{newMemberInput()}
						{(addMemberMessage.msg != undefined)
							&& <>
								<InputLabel>
									{addMemberMessage.msg}
								</InputLabel>
							</>
						}
					</Card>
				</Grid>


			</Grid>
		)
	}

	const portfolioSelector = () => {
		const changePortfolioID = event => {
			setPrefPortfolioParams({ portID: event.target.value })
		}

		return (
			<CardContent id='new-pref-port-select'>
				<Typography variant="h6">Preferred Portfolio: <strong>Portfolio {prefPortfolio}</strong></Typography>
				{/* <Typography variant="subtitle1">{prefPortfolio}</Typography> */}
				<Box>
					<FormControl sx={{ m: 1, minWidth: 180 }} display="flex" fullWidth="true">
						<InputLabel id='pref-port-select-label'>Change Preferred Portfolio</InputLabel>
						<Select
							labelId='pref-port-select-label'
							id='pref-port-select'
							label="Portfolio Number"
							onChange={changePortfolioID}
						>
							<MenuItem value={'1'}>1</MenuItem>
							<MenuItem value={'2'}>2</MenuItem>
							<MenuItem value={'3'}>3</MenuItem>
							<MenuItem value={'4'}>4</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</CardContent>
		);
	}

	const newMemberInput = () => {
		const changeNewMemberName = event => {
			setAddGroupMemberParams({
				name: event.target.value,
				title: addGroupMemberParams.title
			})
		}
		const changeNewMemberGroup = event => {
			setAddGroupMemberParams({
				name: addGroupMemberParams.name,
				title: event.target.value
			})
		}

		return (
			<div className='new-member-input'>
			
								<Button
					onClick={() => setNewMemberModalOpen(true)}
					variant='contained'
				>				<Typography variant="h6"><strong>Add Member to Existing Group</strong></Typography>
				</Button>
				<Popover
					open={newMemberModalOpen}
					onClose={() => setNewMemberModalOpen(false)}
					anchorReference={"none"}
					classes={{
						root: classes.popoverRoot,
					}}
					PaperProps={{
						style: { width: '480px', height: '270px' },
					}}
					BackdropProps={{ invisible: false }}
				>
					{/* <Paper> */}
					<Box
						sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
						component="form"
						noValidate
						autoComplete="off"
					>
						<h1>Add User to Group</h1>

<TextField style={{ margin: '15px 0', width: '80%' }} InputProps={{ className: classes.input }} label="Group Name" onChange={event => changeNewMemberGroup(event)} />
					<TextField style={{ margin: '0 0 20px 0', width: '80%' }} InputProps={{ className: classes.input }} label="New Group Member" onChange={event => changeNewMemberName(event)} />
					<Button
						variant="contained"
						style={{width: '100%', position: 'absolute', bottom: 0}}
						size="large"
						onClick={() => { callEvent.addGroupMember(addGroupMemberParams.name, addGroupMemberParams.title); setGroupsChanged(!groupsChanged); setNewMemberModalOpen(false) }}
						disabled={addGroupMemberParams.name == '' || addGroupMemberParams.title == ''}
					>Add Member</Button>
					</Box>
				</Popover>

				{/* <Typography variant="h6"><strong>Add Member to Existing Group</strong></Typography>
				<Box
					sx={{ m: 2 }}
					component="form"
					noValidate
					autoComplete="off"
				>
					<TextField style={{ margin: '0 10px' }} InputProps={{ className: classes.input }} label="Group Name" onChange={event => changeNewMemberGroup(event)} />
					<TextField style={{ margin: '0 10px' }} InputProps={{ className: classes.input }} label="New Group Member" onChange={event => changeNewMemberName(event)} />
					<Button
						variant="contained"
						style={{ margin: '0 10px' }}
						size="large"
						onClick={() => { callEvent.addGroupMember(addGroupMemberParams.name, addGroupMemberParams.title); setGroupsChanged(!groupsChanged) }}
						disabled={addGroupMemberParams.name == '' || addGroupMemberParams.title == ''}
					>Add Member</Button>
				</Box> */}
			</div>
		);
	}


	const refreshGroupControls = (
		<CardContent className='groups-text-and-refresh'>
			<Typography variant="h6"><strong>Groups I Belong To</strong></Typography>
			{/* <IconButton
				onClick={callEvent.getUserGroupMemberships}
				className='refresh-group-membership'
			>
				<RefreshIcon />
			</IconButton> */}
		</CardContent>
	)

	const refreshGroupOwnships = (
		<CardContent className='ownships-text-and-refresh'>
			<Typography variant="h6"><strong>Groups I Own</strong></Typography>
			{/* <IconButton
				onClick={callEvent.getUserGroupOwnships}
				className='refresh-group-ownship'
			>
				<RefreshIcon />
			</IconButton> */}
		</CardContent>
	)

	const useIsMount = () => {
		const isMountRef = React.useRef(true);
		useEffect(() => {
		  isMountRef.current = false;
		}, []);
		return isMountRef.current;
	  };
	const isMount = useIsMount();


	useEffect(() => {
		if(createGroupMessage.msg != undefined && !isMount) {
			if(createGroupMessage.msg === 'New group created.') {
				Swal.fire({title: 'New group created', icon: 'success', showConfirmButton: false, timer: 1000})
			} else {
				Swal.fire({
					title: 'Could not create group', 
					text: createGroupMessage.msg, 
					icon: 'error', 
					timer: 2000
				})
			}
		}
	}, [createGroupMessage])

	useEffect(() => {
		if(addMemberMessage.msg != undefined && !isMount) {
			if(addMemberMessage.msg.includes('New member added to')) {
				Swal.fire({
					title: 'User added to group', 
					icon: 'success', 
					showConfirmButton: false, 
					timer: 1000
				})
			} else {
				Swal.fire({
					title: 'Could not add user to group', 
					text: addMemberMessage.msg, 
					icon: 'error', 
					timer: 2000
				})
			}
		}
	}, [addMemberMessage])


	const newGroupInput = () => {
		const changeNewGroupName = event => {
			setCreateGroupParams({
				title: event.target.value
			})
		}
		return (
			<div className='new-group-input'>
				<Button
					onClick={() => setNewGroupModalOpen(true)}
					variant='contained'
				><Typography variant="h6"><strong>Add a New Group</strong></Typography></Button>
				<Popover
					open={newGroupModalOpen}
					onClose={() => setNewGroupModalOpen(false)}
					anchorReference={"none"}
					classes={{
						root: classes.popoverRoot,
					}}
					PaperProps={{
						style: { width: '480px', height: '200px' },
					}}
					BackdropProps={{ invisible: false }}
				>
					{/* <Paper> */}
					<Box
						sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
						component="form"
						noValidate
						autoComplete="off"
					>
						<h1>Create a New Group</h1>
						<TextField InputProps={{ className: classes.input }}
							id="new-group-name"
							label="New Group Name"
							onChange={event => changeNewGroupName(event)}
							style={{ fontSize: '20px', marginTop: '10px', width: '80%'}}

						/>
						<Button
							variant="contained"
							size="large"
							onClick={() => { callEvent.createGroup(createGroupParams.title); setGroupsChanged(!groupsChanged); setNewGroupModalOpen(false) }}
							disabled={createGroupParams.title == ''}
							style={{width: '100%', position: 'absolute', bottom: 0}}
						>
							Create Group
						</Button>
					</Box>

					{/* Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
						<CardHeader title='Create a New Group'/>
						<CardContent>
						<TextField InputProps={{ className: classes.input }}
							id="new-group-name"
							label="New Group Name"
							onChange={event => changeNewGroupName(event)}
							style={{ margin: '20px 10px', fontSize: '20px' }}

						/>
						</CardContent>
						<CardActions>
						<Button
							variant="contained"
							size="large"
							onClick={() => { callEvent.createGroup(createGroupParams.title); setGroupsChanged(!groupsChanged) }}
							disabled={createGroupParams.title == ''}
						>
							Create Group
						</Button>
						</CardActions>


						</Card> */}
					{/* </Paper> */}
					{/* {(createGroupMessage.msg != undefined)
							&& <>
								<InputLabel>
									{createGroupMessage.msg}
								</InputLabel>
							</>
						} */}
				</Popover>
			</div>
		);
	}

	const myRankDisplay = () => {
		return <Grid container spacing={2} direction="column" justifyContent="center" alignItems="center">
			<Card item sx={{ width: '75%', backgroundColor: 'rgb(220,240,220)' }}>
				<Typography gutterBottom variant="h4"><strong>Username:</strong> {backend.profile.username}</Typography>
				<img src={backend.profile.profilePicPath} width="100px" length="100px" />
				<Typography variant="h5"><strong>Score:</strong> {backend.profile.score}</Typography>
				<CardContent display="flex" fullWidth="true">
					<Typography variant="h5"><strong>Your Current Quarter Rank is:</strong></Typography>
					{(rankNumber != 0 && rankTotal != 0)
						&& <>
							<Box display="flex" fullWidth="true">
								<AutoAwesomeIcon fontSize="large" sx={{ color: amber[400] }} />
								<Typography sx={{ flexGrow: 1, }} variant="h3"><strong><span className='green'>{rankNumber}</span> out of {rankTotal}</strong></Typography>
								<AutoAwesomeIcon fontSize="large" sx={{ color: amber[400] }} />
							</Box>
						</>
					}
					<Typography variant="h5"><strong>Your Lifetime Rank History is:</strong></Typography>
					{(rankStats.length > 1)
						&& <>
							<ResponsiveContainer width="100%" aspect={3}>
								<LineChart data={rankStats.map(stat => ({ quarterEnd: formatStatDate(stat.quarterEnd), finalValue: stat.finalValue }))} margin={{ right: 300 }}>
									<XAxis dataKey="quarterEnd" interval={"preserveStartEnd"} />
									<YAxis></YAxis>
									<Line isAnimationActive={false} dataKey="finalValue" stroke="black" dot={{ stroke: "darkblue", strokeWidth: 2, r: 10 }} />
								</LineChart>
							</ResponsiveContainer>
						</>
					}
					{(rankStats.length === 0)
						&& <>
							<Typography variant="h6">No lifetime stats are available for this user. Check at the end of the quarter!</Typography>
						</>
					}
					<p />
					<Typography variant="h5"><strong>Your Current Title is:</strong></Typography>
					{(rankTitle != '')
						&& <>
							<Box display="flex" fullWidth="true">
								<AttachMoneyIcon fontSize="large" sx={{ color: green[800] }} />
								<Typography sx={{ flexGrow: 1, fontWeight: 900, color: green[700] }} variant="h3"><strong>{rankTitle}</strong></Typography>
								<AttachMoneyIcon fontSize="large" sx={{ color: green[800] }} />
							</Box>
						</>
					}
				</CardContent>
			</Card>
		</Grid>
	}

	return (
		<div class='profile-page' id='group-page'>
			{/* <h1>My Profile</h1> */}
			{/* {myRankDisplay()} */}
			<Grid container spacing={5} direction="row" justifyContent="center" alignItems="center">
							{/* <Grid item xs={7} sm={7}>

				{newGroupInput()}

			</Grid>
			<Grid item xs={7} sm={7}>
				<Card>
					{newMemberInput()}
					{(addMemberMessage.msg != undefined)
						&& <>
							<InputLabel>
								{addMemberMessage.msg}
							</InputLabel>
						</>
					}
				</Card>
			</Grid> */}
				<Grid item xs={3}>
					<Card>
						<center>{refreshGroupControls}</center>
						{(currentGroupMemberships.success != undefined && currentGroupMemberships.success)
							&& <>
								<List sx={{ listStyleType: 'disc', pl: 4 }} className='current-mems-return'>
									{
										currentGroupMemberships.data.map((mem, i) => <ListItem sx={{ display: 'list-item' }}><ListItemText primary={mem} /></ListItem>)
									}
								</List>
							</>
						}
					</Card>
				</Grid>
				<Grid item xs={3}>
					<Card>
						<center>{refreshGroupOwnships}</center>
						{(currentGroupOwnships.success != undefined && currentGroupOwnships.success)
							&& <>
								<List sx={{ listStyleType: 'disc', pl: 4 }} className='current-owns-return'>
									{
										currentGroupOwnships.data.map((own, i) => <ListItem sx={{ display: 'list-item' }}><ListItemText primary={own} /></ListItem>)
									}
								</List>
							</>
						}
					</Card>
				</Grid>
				<Grid item xs={7} sm={7}>

						{newGroupInput()}

				</Grid>
				<Grid item xs={7} sm={7}>
						{newMemberInput()}
				</Grid>


			</Grid>

		</div>
	)
}
