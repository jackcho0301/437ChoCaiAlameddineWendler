import React, { useEffect } from 'react'
import axios from 'axios'


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
    allScores: [{name: 'Loading', score: 0}],
    boughtStock: {},
    soldStock: {},
    dollarsAdded: 0,
    currentPortfolio: {},
    groupMemberships: {},
    groupOwnships: {},
    createGroupResponse: {},
    addMemberResponse: {},
    currentTitle: {},
    currentStats: {}
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
                boughtStock: action.value
            }
        }
        case "soldStock": {
            return {
                ...state,
                soldStock: action.value
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
    }
}
