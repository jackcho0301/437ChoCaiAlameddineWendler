import React from "react"
import { reducer, events } from "./EventsReducer"
import axios from 'axios'

export const EventsContext = React.createContext({
    state: events,
    dispatch: () => null
})

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

export const EventsProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, events)

    const communicationEvents = {
      login: async (username, password) => {
        await axios.post("http://localhost:3000/api/v1/auth/login",
            { username: username, password: password }, config
        )
            .then(function (response) {
                DEBUG.login && console.log('Login response:', response);
                dispatch({type: "login", value: response})
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    register: async (username, password) => {
      await axios.post('http://localhost:3000/api/v1/auth/register',
          { "username": username, "password": password }
      )
          .then(function (response) {
              DEBUG.register && console.log('Register response:', response);
              dispatch({type: "register", value: response})
          })
          .catch(function (error) {
              console.log(error);
          });
  },
  
    getScores: async () => {
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
              DEBUG.getScores && console.log('Get Scores sorted response:', response.data);
              dispatch({type: "scores", value: ret})

          })
          .catch(function (error) {
              console.log(error);
          });
  },
      // buyStock: buyStock,
      // sellStock: sellStock,
      // addDollars: addDollars,
      // getPortfolio: getPortfolio,
    }

    return (
        <EventsContext.Provider value={[state, communicationEvents]}>
            { children}
        </EventsContext.Provider>
    )
}




// import React from 'react'
// import axios from 'axios'
// import { UserContext } from "./User"


// const [user, modifyUser] = React.useContext(UserContext)

// const DEBUG = {
//   login: true,
//   getScores: true,
//   register: true,
//   buyStock: true,
//   sellStock: true,
//   createPortfolio: true
// }

// const config = {
//   headers: {
//     'Content-Type': 'application/json'
//     },
//     withCredentials: true
//   }

// const deleteConfig = {
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   withCredentials: true,
//   data: {
//     'stockName': 'F'
//   }
// }

// export const login = async (username, password) => {
//   await axios.post("http://localhost:3000/api/v1/auth/login",
//       {username: username, password: password}, config
//   )
//   .then(function (response) {
//       DEBUG.login && console.log('Login response:', response);
//   })
//   .catch(function (error) {
//       console.log(error);
//   });
//   }

// export const getScores = async () => {
//   await axios.get('http://localhost:3000/api/v1/portfolios', config)
//   .then(function (response) {
//   //   console.log(JSON.stringify(response, 0, 2));
//   DEBUG.getScores && console.log('Get Scores response:', response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// }

// export const register = async (username, password) => {
//   await axios.post('http://localhost:3000/api/v1/auth/register', 
//     {"username": username, "password": password}
//   )
//   .then(function (response) {
//       DEBUG.register && console.log('Register response:', response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// }

// export const buyStock = async (stockname, numofunits, initcost) => {
//   await axios.patch('http://localhost:3000/api/v1/portfolios/1',
//       {"stockName": "F", "numOfUnits": 10, "initCost": 10}, config)
//   .then(function (response) {
//       DEBUG.buyStock && console.log('Buy Stock response:', response.data);
//   })
//   .catch(function (error) {
//       console.log(error);
//   });
// }

// export const sellStock = async stockname => {
//   await axios.delete('http://localhost:3000/api/v1/portfolios/1',
//       deleteConfig)
//   .then(function (response) {
//       DEBUG.sellStock && console.log('Sell Stock response:', response.data);
//   })
//   .catch(function (error) {
//       console.log(error);
//   });
// }

// export const addDollars = async () => {
//   await axios.get('http://localhost:3000/api/v1/portfolios/1', config)
//   .then(function (response) {
//       DEBUG.createPortfolio && console.log('Create Portfolio response:', response.data);
//   })
//   .catch(function (error) {
//       console.log(error);
//   });
// }

// export const getPortfolio = async () => {

//   await axios.get('http://localhost:3000/api/v1/portfolios/1', config
//   )
//   .then(function (response) {
//     console.log(response.data)
//     return response.data
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// }