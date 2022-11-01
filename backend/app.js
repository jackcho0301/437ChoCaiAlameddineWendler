require('dotenv').config();
require('express-async-errors');

const express = require('express')
const session = require('express-session')

//option to store session in mongodb
// const MongoDBSession = require('connect-mongodb-session')(session)

const app = express()
const cors = require('cors');
// app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH", "DELETE"],
    credentials: true,
  })
);

//connectDB
const connectDB = require('./db/connect')

//middleware for authentication (placed before porfolio route)
const authenticateUser = require('./middleware/authentication');


//for uploading images
// const multer = require('multer')
// const ProfilePicModel = require('./models/ProfilePic')
app.use(express.static('./uploads'))

//routers
const authRouter = require('./routes/auth')
const portfoliosRouter = require('./routes/portfolios')
const usersRouter = require('./routes/users')
const statsRouter = require('./routes/stats')
const profilePicRouter = require('./routes/profilePic')
const profileRouter = require('./routes/profile')

app.use(session({ //config object
  cookie: {
      maxAge: Number(process.env.SESSION_LIFETIME),
      sameSite: true,
      secure: false,
      httpOnly: true,
  },
  name: process.env.SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
}))



// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json()); //data in req.body is available for POST methods

//middleware for authentication
const extractUserIdMiddleware = require('./middleware/extract-userId');


const ProfilePic = require('./models/ProfilePic')
app.get('/',async (req,res) => {
  const pics = await ProfilePic.find({})
  const pic = pics[0]

  res.send(pic)
 
  // res.send( String.fromCharCode(...new Uint8Array((pic.image.data))))
})


// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/portfolios', extractUserIdMiddleware, portfoliosRouter) //authentication middleware placed 
app.use('/api/v1/stats', extractUserIdMiddleware, statsRouter) // authentication middleware placed
app.use('/api/v1/profilePic', extractUserIdMiddleware, profilePicRouter) // authentication middleware placed
app.use('/api/v1/profile', extractUserIdMiddleware, profileRouter)// authentication middleware placed

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;





const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
