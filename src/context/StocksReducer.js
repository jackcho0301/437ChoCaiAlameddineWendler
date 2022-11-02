const DEBUG = {
    price: true,
    state: true,
    new: true
}

export const stocks = {}

export const reducer = (state, action) => {
    switch (action.type) {
        case "new": {
            if (action.stock in state) {
                DEBUG.new && console.log(action.stock, " already exists")
            } else {
                DEBUG.new && console.log(action.stock, "added to database")
                return {
                    ...state,
                    [action.stock]: {}
                }
            }

        }

        case "reset": {
            // if (!(action.stock in state)) {
            //     console.log(action.stock, " not present")
            // } else {
            return {
                ...state,
                [action.stock]: {}
            }

        }

        case "price": {
            // console.log(action.stock.name, " price set to ", action.stock.price)
            DEBUG.price && console.table([{ ticker: action.stock.name, price: action.stock.price.price, currency: action.stock.price.currency }])
            // DEBUG.state && console.log("Stock state:", state)
            return {
                ...state,
                [action.stock.name]: {
                    ...state[action.stock.name],
                    price: action.stock.price
                }
            }
        }
    }
}