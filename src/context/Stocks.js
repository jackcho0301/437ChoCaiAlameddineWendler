import React from "react"
import { reducer, stocks } from "./StocksReducer"
import yahooStockPrices from "./yahoo-stock-prices"

const DEBUG = {
    state: true,
    price: true,
    new: true,
}

export const StocksContext = React.createContext({
    state: stocks,
    dispatch: () => null
})



export const StocksProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, stocks)

    const update = {
        price: async name => {
            await yahooStockPrices.getCurrentData(name).then((response) => {
                // console.log("price : ", price)
                dispatch({
                    type: "price",
                    stock: { name: name, price: response }
                })
                //   DEBUG.price && console.log(name, " price set to ", [name].price)


            }).catch(() => {
                console.log('No data for', name)
            });
        },
        new: name => {
            dispatch({
                type: "new",
                stock: name
            })
            DEBUG.new && console.log("Stock", name, "added to database")

        }
    }

    return (
        <StocksContext.Provider value={[state, update]}>
            {children}
        </StocksContext.Provider>
    )
}