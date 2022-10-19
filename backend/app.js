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

//routers
const authRouter = require('./routes/auth')
const portfoliosRouter = require('./routes/portfolios')
const usersRouter = require('./routes/users')

/*
const store = new MongoDBSession ({
    uri: process.env.MONGO_URI,
    collection: "sessions",
})

app.use(session({
    name: process.env.SESSION_NAME,
    secret: process.env.SECRET_KEY,
    resave: false, //for every request to server, create new session? -> false
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: Number(process.env.SESSION_LIFETIME),
      sameSite: true,
      secure: false
    }
}))
*/

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



// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/portfolios', extractUserIdMiddleware, portfoliosRouter) //authentication middleware placed 


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