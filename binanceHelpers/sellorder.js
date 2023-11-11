const { binance } = require("../binanceConnect");

const sellOrder = async (symbol, quantity, price) => {
    try {
        await binance.futuresSell(symbol, quantity, price);
    } catch (error) {
        console.log(error?.message);
    }
};

module.exports = { sellOrder };