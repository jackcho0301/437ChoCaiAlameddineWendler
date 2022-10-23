import { AgricultureSharp } from "@mui/icons-material"

const DEBUG = {
    action: true
}

export const reducer = (state, action) => {
    DEBUG.action && console.log('action taken:', action)
    switch (action.type) {
        case "login":
            return {
                ...state,
                loggedIn: action.value
            }
            break

        case "username":
            return {
                ...state,
                username: action.value
            }
            break

        default:
            throw new TypeError('Unable to decipher user action')
    }
}

export const initialState = {
    username: '',
    loggedIn: false
}