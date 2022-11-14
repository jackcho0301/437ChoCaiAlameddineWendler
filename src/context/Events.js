import React from "react"
import { reducer, values } from "./EventsReducer"
import axios from 'axios'
import { url } from "../config/constants"



export const EventsContext = React.createContext({
    state: values,
    dispatch: () => null
})

const DEBUG = {
    login: true,
    getScores: true,
    register: true,
    buyStock: true,
    sellStock: true,
    createPortfolio: true,
    getUserGroupMemberships: true,
    getUserGroupOwnships: true,
    createGroup: true,
    addGroupMember: true,
    getTitle: true
}


const config = {
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
}

export const EventsProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, values)

    const communicationEvents = {
        login: async (username, password) => {
            await axios.post(`${url}/api/v1/auth/login`,
                { username: username, password: password }, config
            )
                .then(function (response) {
                    DEBUG.login && console.log('Login response:', response);
                    dispatch({ type: "login", value: response })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        register: async (username, password) => {
            await axios.post(`${url}/api/v1/auth/register`,
                { "username": username, "password": password }
            )
                .then(function (response) {
                    DEBUG.register && console.log('Register response:', response);
                    dispatch({ type: "register", value: response })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        getScores: async () => {
            await axios.get(`${url}/api/v1/portfolios`, config)
                .then(function (response) {
                    //   console.log(JSON.stringify(response, 0, 2));
                    const data = response.data
                    DEBUG.getScores && console.log('Get Scores response:', data);
                    let ret = data.data.map(user => {
                        return {
                            name: user.userName,
                            score: user.score
                        }
                    })
                    DEBUG.getScores && console.log('Get Scores sorted response:', ret);
                    dispatch({ type: "scores", value: ret })

                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        buyStock: async (stockname, numofunits, initcost) => {
            if (initcost === undefined) {
                initcost = 0
            }
            await axios.patch(`${url}/api/v1/portfolios/1`,
                { "stockName": stockname, "numOfUnits": Number(numofunits), "initCost": Number(initcost) }, config)
                .then(function (response) {
                    DEBUG.buyStock && console.log('Buy Stock response:', response.data);
                    dispatch({ type: "boughtStock", value: response.data })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        sellStock: async (stockname, numofunits, cost) => {
            // let deleteConfig = structuredClone(config)
            let deleteConfig = JSON.parse(JSON.stringify(config))
            deleteConfig["data"] = { 'stockName': stockname, "numOfUnits": Number(numofunits), "salePrice": cost }
            await axios.delete(`${url}/api/v1/portfolios/1`, deleteConfig)
                .then(function (response) {
                    DEBUG.sellStock && console.log('Sell Stock response:', response.data);
                    dispatch({ type: "soldStock", value: response.data })

                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        addDollars: async () => {
            await axios.get(`${url}/api/v1/portfolios/1`, config)
                .then(function (response) {
                    DEBUG.createPortfolio && console.log('Create Portfolio response:', response.data);
                    dispatch({ type: "dollarsAdded", value: response.data })

                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        getPortfolio: async () => {
            await axios.get(`${url}/api/v1/portfolios/1`, config
            )
                .then(function (response) {
                    console.log(response.data)
                    // let portfolio = {}
                    // for (obj in response.data) {
                    //     const stockName = obj.stockHoldings.stockName
                    //     if (stockName in portfolio) {
                    //         portfolio[stockName].holding += obj.stockHoldings.holding
                    //     } else {
                    //         portfolio
                    //     }
                    // }
                    dispatch({ type: "portfolio", value: response.data })
                    dispatch({type: "portfolioLoaded"})
                })
                .catch(function (error) {
                    console.error(error);
                });
        },

        createPortfolio: async () => {
            await axios.post(`${url}/api/v1/portfolios/`, {
                "portId": 1,
                "stockName": "dollars",
                "numOfUnits": 10000,
                "initCost": 1
            }, config
            )
                .then(function (response) {
                    console.log(response);
                    dispatch({type: 'createPortfolio', value: response.data})
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        logout: async () => {
            await axios.post(`${url}/api/v1/auth/logout`, {}, config)
                .then(function (response) {
                    console.log(response);
                    window.location.reload()
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getUserGroupMemberships: async () => {
            await axios.get(`${url}/api/v1/groups`, config)
                .then(function (response) {
                    console.log(response.data)
                    dispatch({ type: "group", value: response.data })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        getUserGroupOwnships: async () => {
            await axios.get(`${url}/api/v1/groupowns`, config)
                .then(function (response) {
                    console.log(response.data)
                    dispatch({ type: "groupOwn", value: response.data })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        createGroup: async groupTitle => {
            await axios.post(`${url}/api/v1/groupowns`,
                { "groupTitle": groupTitle }, config)
                .then(function (response) {
                    console.log(response);
                    dispatch({ type: "createGroupRes", value: response.data })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        addGroupMember: async (name, groupTitle) => {
            await axios.post(`${url}/api/v1/groups`,
                { "name": name, "groupTitle": groupTitle }, config)
                .then(function (response) {
                    console.log(response);
                    dispatch({ type: "addMemberRes", value: response.data })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        getTitle: async () => {
            await axios.get(`${url}/api/v1/stats/title`, config)
                .then(function (response) {
                    console.log(response.data)
                    dispatch({ type: "title", value: response.data })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        getStats: async () => {
            await axios.get(`${url}/api/v1/stats`, config)
                .then(function (response) {
                    console.log(response.data)
                    dispatch({ type: "stats", value: response.data })
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    return (
        <EventsContext.Provider value={[state, communicationEvents]}>
            {children}
        </EventsContext.Provider>
    )
}