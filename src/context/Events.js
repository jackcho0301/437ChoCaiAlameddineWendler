import axios from 'axios'

const DEBUG = {
    login: true,
    getScores: true,
    register: true
}

const config = {
    headers: {
      'Content-Type': 'application/json'
      },
      withCredentials: true
    }

export const login = async (username, password) => {
    await axios.post("http://localhost:3000/api/v1/auth/login",
        {username: username, password: password}, config
    )
    .then(function (response) {
        DEBUG.login && console.log('Login response:', response);
    })
    .catch(function (error) {
        console.log(error);
    });
    }

export const getScores = async () => {
    await axios.get('http://localhost:3000/api/v1/portfolios', config)
    .then(function (response) {
    //   console.log(JSON.stringify(response, 0, 2));
    DEBUG.getScores && console.table('Get Scores response:', response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

export const register = async (username, password) => {
    await axios.post('http://localhost:3000/api/v1/auth/register', 
      {"username": username, "password": password}
    )
    .then(function (response) {
        DEBUG.register && console.log('Register response:', response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export const createPortfolio = async () => {
  await axios.post('http://localhost:3000/api/v1/portfolios/', {
    "portId": 1,
    "stockName": "TWTR",
    "numOfUnits": 75,
    "initCost": 60.00
 }, config
  )
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

export const getPortfolio = async () => {

  await axios.get('http://localhost:3000/api/v1/portfolios/1', config
  )
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}



export const updatePortfolio = async () => {
  await axios.patch('http://localhost:3000/api/v1/portfolios/1', {
    "stockName" : "AAPL",
    "numOfUnits" : 100,
     "initCost" : 100
}, config
  )
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}


export const sellPortfolioItem = async () => {
  await axios.delete('http://localhost:3000/api/v1/portfolios/1', {
    "stockName" : "AAPL"
}, config
  )
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}