const Stat = require('../models/Stat')
const User = require('../models/User')
const fetch = require('node-fetch')

// Note that the year doesn't matter for constant dates.
const FSTQTREND = new Date(2000, 2, 31)
const SNDQTREND = new Date(2000, 5, 30)
const TRDQTREND = new Date(2000, 8, 30)
const FTHQTREND = new Date(2000, 11, 31)

// API for retrieving all stats for the currently logged-in user.
// No body required.
const getStats = async (req, res) => {
    const statInfo = await Stat.find({userId:req.user.userId})

    if (statInfo) {
        res.status(200).json({success:true,data:statInfo})
    }
    else {
	res.status(400).json({success:false,msg:'An error occurred retrieving the user\'s stats'})
    }
}

// API for retrieving the user's name and title. The name is important
// for returning ranking out of all users. 
const getTitle = async (req, res) => {
    const userInfo = await User.find({_id:req.user.userId})

    const titleInfo = {user:userInfo[0].username,title:'foobar'}
    if (userInfo) {
	res.status(200).json({success:true,data:titleInfo})
    }
    else {
	res.status(400).json({success:false,msg:'An error occurred retrieving the user\'s stats'})
    }
}

// API for entering a new stat for the currently logged-in user.
// We may need something a bit more sophisticated later that can
// auto-enter this for all users simultaneously.
// Body format shoud be:
// {
// 	"endDate": (An ISO String that must conform to the end
// 	of a quarter (3/31/XXXX, 6/30/XXXX, 9/30/XXXX, 12/31/XXXX))
// 	"score": (A numeric value that should be the same as the user's
// 	totalValue at the time of this entry)
// }
// NOTE: To get the endDate, first make your Date into a Date object,
// then invoke the toISOString() method.
const putStat = async (req, res) => {
    const {endDate, score} = req.body
    const endDateObj = new Date(endDate)

    let validDate = true

    // Valid dates are only ones that occur at the end of the quarter.
    if (((endDateObj.getDate() == FSTQTREND.getDate()) && (endDateObj.getMonth() == FSTQTREND.getMonth())) ||
        ((endDateObj.getDate() == SNDQTREND.getDate()) && (endDateObj.getMonth() == SNDQTREND.getMonth())) ||
	((endDateObj.getDate() == TRDQTREND.getDate()) && (endDateObj.getMonth() == TRDQTREND.getMonth())) ||
	((endDateObj.getDate() == FTHQTREND.getDate()) && (endDateObj.getMonth() == FTHQTREND.getMonth()))) {
        // See if an entry already exists for this.
	existingStat = await Stat.find({userId:req.user.userId,quarterEnd:endDateObj})
	if (existingStat.length > 0){
	    // Update the existing stat.
	    await Stat.updateOne({userId:req.user.userId,quarterEnd:endDateObj},{finalValue:score})
	}
	else {
	    // Add the new entry.
	   const statistic = new Stat({
	       userId: req.user.userId,
	       quarterEnd: endDateObj,
	       finalValue: score,
	   });
	
           await statistic.save();
        }
    }
    else {
	validDate = false
    }

    if (!validDate) {
        res.status(400).json({success:false,msg:'The date must be the end of a quarter'})
    }
    else {
	res.status(200).json({success:true,msg:'New stat added'})
    }
}

module.exports = {
    getStats,
    getTitle,
    putStat
}
