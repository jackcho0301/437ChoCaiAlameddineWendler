require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();


//connectDB
const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/auth')
const portfoliosRouter = require('./routes/portfolios')



// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json()); //data in req.body is available for POST methods
// extra packages

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/portfolios', portfoliosRouter)



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
