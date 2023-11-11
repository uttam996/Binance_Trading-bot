const { binance } = require("../binanceConnect");

const placeBuyOrder = async (symbol, quantity, price) => {
  try {
    await binance.futuresBuy(symbol, quantity, price);
  } catch (error) {
    console.log(error?.message);
  }
};

module.exports = { placeBuyOrder };
