import React, { useEffect } from 'react'
import axios from 'axios'


const DEBUG = {
    login: true,
    getScores: true,
    register: true,
    buyStock: true,
    sellStock: true,
    createPortfolio: true
}

const config = {
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
}

const deleteConfig = {
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    data: {
        'stockName': 'F'
    }
}

const login = async (username, password) => {
    await axios.post("http://localhost:3000/api/v1/auth/login",
        { username: username, password: password }, config
    )
        .then(function (response) {
            DEBUG.login && console.log('Login response:', response);
            return response
        })
        .catch(function (error) {
            console.log(error);
        });
}

const getScores = async () => {
    await axios.get('http://localhost:3000/api/v1/portfolios', config)
        .then(function (response) {
            //   console.log(JSON.stringify(response, 0, 2));
            DEBUG.getScores && console.log('Get Scores response:', response.data);
            const ret = response.data.data.map(user => {
                return {
                    name: user.userName,
                    score: user.score
                }
            })
            console.log('scores from api', ret)
            return ret
        })
        .catch(function (error) {
            console.log(error);
        });
}

const register = async (username, password) => {
    await axios.post('http://localhost:3000/api/v1/auth/register',
        { "username": username, "password": password }
    )
        .then(function (response) {
            DEBUG.register && console.log('Register response:', response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

const buyStock = async (stockname, numofunits, initcost) => {
    await axios.patch('http://localhost:3000/api/v1/portfolios/1',
        { "stockName": "F", "numOfUnits": 10, "initCost": 10 }, config)
        .then(function (response) {
            DEBUG.buyStock && console.log('Buy Stock response:', response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

const sellStock = async stockname => {
    await axios.delete('http://localhost:3000/api/v1/portfolios/1',
        deleteConfig)
        .then(function (response) {
            DEBUG.sellStock && console.log('Sell Stock response:', response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

const addDollars = async () => {
    await axios.get('http://localhost:3000/api/v1/portfolios/1', config)
        .then(function (response) {
            DEBUG.createPortfolio && console.log('Create Portfolio response:', response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

const getPortfolio = async () => {

    await axios.get('http://localhost:3000/api/v1/portfolios/1', config
    )
        .then(function (response) {
            console.log(response.data)
            return response.data
        })
        .catch(function (error) {
            console.log(error);
        });
}

// switch (call) {
//     case "login":
//         return login(...params)
//     case "getScores":
//         return getScores(...params)
// }

export const events = {
    // login: login,
    // register: register,
    // getScores: getScores,
    // buyStock: buyStock,
    // sellStock: sellStock,
    // addDollars: addDollars,
    // getPortfolio: getPortfolio,
    registeredUser: '',
    loggedInUser: '',
    allScores: [{}],
}

export const reducer = (state, action) => {
    switch (action.type) {
        case "login": {
            return {
                ...state,
                loggedInUser: action.value.data.username
            }
        }
        case "scores": {
            return {
                ...state,
                allScores: action.value
            }
        }
        case "register": {
            return {
                ...state,
                registeredUser: action.value.data.username
            }
        }
    }
    // switch (action.type) {
    //     case "login": {
    //         const [username, password] = action.value
    //         const user = async (username, password) => {
    //             return await axios.post("http://localhost:3000/api/v1/auth/login",
    //                 { username: username, password: password }, config
    //             )
    //                 .then(function (response) {
    //                     DEBUG.login && console.log('Login response:', response);
    //                     return response
    //                 })
    //                 .catch(function (error) {
    //                     console.log(error);
    //                 });
    //         }
    //         Promise.all([user]).then(() => {
    //             return {
    //                 ...state,
    //                 loggedInUser: user
    //             }
    //         })
    //         break
    //     }

    //     // case "getScores": {
    //     //     const scores = await axios.get('http://localhost:3000/api/v1/portfolios', config)
    //     // .then(function (response) {
    //     //     //   console.log(JSON.stringify(response, 0, 2));
    //     //     DEBUG.getScores && console.log('Get Scores response:', response.data);
    //     //     const ret = response.data.data.map(user => {
    //     //         return {
    //     //             name: user.userName,
    //     //             score: user.score
    //     //         }
    //     //     })
    //     //     console.log('scores from api', ret)
    //     //     scores = ret
    //     // })
    //     // .catch(function (error) {
    //     //     console.log(error);
    //     // });


    //     //     return {
    //     //         ...state,
    //     //         allScores: scores
    //     //     }
    //     //     break
    //     // }

    //     case "portfolio":
    //         return {
    //             ...state,
    //             portfolio: action.value
    //         }
    //         break

    //     default:
    //         throw new TypeError('Unable to decipher event action')
    // }
}