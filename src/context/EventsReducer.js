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
    getStats: true,
    getGroups: true
}

export const values = {
    registeredUser: '',
    loggedInUser: '',
    allScores: [{ name: 'Loading', score: 0 }],
    boughtStock: [],
    soldStock: [],
    dollarsAdded: [],
    currentPortfolio: {},
    groupMemberships: {},
    groupOwnships: {},
    createGroupResponse: {},
    addMemberResponse: {},
    currentTitle: {},
    currentStats: {},
    createdPortfolio: {},
    portfolioLoaded: false,
    profile: {},
    prefPortNumber: '',
    groupMembers: {},
    buyMessage: '',
    sellMessage: '',
    groups: {}
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
            let bought = state.boughtStock
            bought.push(action.value.data)
	    if (action.value.msg !== undefined) {
                return {
                    ...state,
                    boughtStock: bought,
		    buyMessage: action.value.msg
                }
	    }
	    else {
		return {
		    ...state,
		    boughtStock: bought,
		    buyMessage: ''
		}
	    }
        }
        case "soldStock": {
            let sold = state.soldStock
            sold.push(action.value.data)
	    if (action.value.msg !== undefined) {
                return {
                    ...state,
                    soldStock: sold,
		    sellMessage: action.value.msg
                }
	    }
	    else {
		return {
		    ...state,
		    soldStock: sold,
		    sellMessage: ''
		}
	    }
        }
        case "dollarsAdded": {
            let added = state.dollarsAdded
            added.push(action.value.data)
            return {
                ...state,
                dollarsAdded: added
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
	case "groups": {
            return {
		...state,
		groups: action.value
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
        case "profile": {
	    return {
	        ...state,
	        profile: action.value
	    }
	}
        case "logout": {
	    return {
	        ...state,
		logoutResponse: {}
	    }
	}
        case "prefPortNumber": {
	    return {
		...state,
		prefPortNumber: action.value.data
	    }
	}
	case "groupMembers": {
	    return {
		...state,
		groupMembers: action.value.data
	    }
	}
    }
}
