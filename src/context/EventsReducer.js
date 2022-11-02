import React, { useEffect } from 'react'


const DEBUG = {
    login: true,
    getScores: true,
    register: true,
    buyStock: true,
    sellStock: true,
    createPortfolio: true
}

export const values = {
    registeredUser: '',
    loggedInUser: '',
    allScores: [{name: 'Loading', score: 0}],
    boughtStock: 0,
    soldStock: 0,
    dollarsAdded: 0,
    currentPortfolio: {}
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
        case "boughtStock": {
            return {
                ...state,
                boughtStock: action.value.data
            }
        }
        case "soldStock": {
            return {
                ...state,
                soldStock: action.value.data
            }
        }
        //TODO: set up bought and dollars to be cumulative
        case "dollarsAdded": {
            return {
                ...state,
                dollarsAdded: action.value
            }
        }

        case "portfolio": {
            return {
                ...state,
                currentPortfolio: action.value
            }
        }
    }
}
