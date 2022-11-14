import React, { useEffect } from 'react'


const DEBUG = {
    login: true,
    getScores: true,
    register: true,
    buyStock: true,
    sellStock: true,
    createPortfolio: true,
    getUserGroupMemberships: true,
    createGroup: true,
    addGroupMembership: true,
    getTitle: true,
    getStats: true
}

export const values = {
    registeredUser: '',
    loggedInUser: '',
    allScores: [{ name: 'Loading', score: 0 }],
    boughtStock: {},
    soldStock: {},
    dollarsAdded: 0,
    currentPortfolio: {},
    groupMemberships: {},
    groupOwnships: {},
    createGroupResponse: {},
    addMemberResponse: {},
    currentTitle: {},
    currentStats: {},
    createdPortfolio: {},
    portfolioLoaded: false
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
                boughtStock: state.boughtStock + action.value.data
            }
        }
        case "soldStock": {
            return {
                ...state,
                soldStock: state.soldStock + action.value.data
            }
        }
        case "dollarsAdded": {
            return {
                ...state,
                dollarsAdded: state.dollarsAdded + action.value.data
            }
        }

        case "portfolio": {
            return {
                ...state,
                currentPortfolio: action.value
            }
        }

        case "portfolioLoaded": {
            return {
                ...state,
                portfolioLoaded: true
            }
        }

        case "group": {
            return {
                ...state,
                groupMemberships: action.value
            }
        }
        case "groupOwn": {
            return {
                ...state,
                groupOwnships: action.value
            }
        }
        case "createGroupRes": {
            return {
                ...state,
                createGroupResponse: action.value
            }
        }
        case "addMemberRes": {
            return {
                ...state,
                addMemberResponse: action.value
            }
        }
        case "title": {
            return {
                ...state,
                currentTitle: action.value
            }
        }
        case "stats": {
            return {
                ...state,
                currentStats: action.value
            }
        }
        case "createPortfolio": {
            return {
                ...state,
                createdPortfolio: action.value
            }
        }
    }
}
