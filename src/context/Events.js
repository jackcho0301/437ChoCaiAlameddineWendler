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
    DEBUG.getScores && console.log('Get Scores response:', response);
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