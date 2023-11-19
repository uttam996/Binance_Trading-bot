const EventEmitter = require("node:events");
const TickerModel = require("../Model/tickers.model");
const Trades = require("../Model/trades.model");
const myEmitter = new EventEmitter();

// First listener
myEmitter.on("buyHandler", async (trade) => {
  try {
    const { binance } = require("../binanceConnect");

    const Ticker = await TickerModel.findOne({ symbol: trade.s });
    if (!Ticker) return console.log("Ticker not found");
    if (Ticker.running === false) return console.log("Ticker is Off ");
    const { i: orderId, s: symbol, q: quantity, L: buyPrice } = trade;
    // console.log(trade)

    // await binance.futuresBuy(symbol, quantity, price);
    // create trade entry

    //  sellPercentage

    //  await FutureTradeModel.create({
    //   orderId,
    //   symbol,
    //   quantity,
    //   buyPrice,
    //   buyTime: new Date(),
    //  });
    await Trades.create({
      Symbol: symbol,
      buyQuantity: quantity,
      buyPrice: buyPrice,
    });

    console.log(buyPrice, quantity, Ticker.sellPercentage);

    let sellPrice = buyPrice * ((100 + Ticker.sellPercentage) / 100);
    let limitbuyPrice = buyPrice * ((100 - Ticker.buyPercentage) / 100);
    // console.log(symbol,quantity,+sellPrice.toFixed(Ticker?.fixed))
    await binance.futuresSell(
      symbol,
      quantity,
      sellPrice.toFixed(Ticker?.fixed)
    );
    console.log("limit sell", symbol, quantity);
    console.log('closed event emitted')
    myEmitter.emit('clsoedTrade',symbol)
    await binance.futuresBuy(
      symbol,
      quantity,
      limitbuyPrice.toFixed(Ticker?.fixed)
    );
    console.log("limit buy", symbol, quantity);
  } catch (error) {
    console.log(error);
    console.log("Failed to create limit sell order");

    return;
  }
});

myEmitter.on("SellHandler", async (trade) => {
  try {
    const { binance } = require("../binanceConnect");
    console.log("Sell Handler");

    // const trade = await Trades.findOne({ Symbol: trade.s });
    // find trade entry with lowest buy price and sell it

    const { i: orderId, s: symbol, q: quantity, L: sellPrice } = trade;
    const order = await Trades.findOne({
      Symbol: trade.s,
      sellPrice: { $exists: false },
    }).sort({ buyPrice: 1 });

    order.sellPrice = sellPrice;
    order.sellQuantity = quantity;

    await order.save();

    const Ticker = await TickerModel.findOne({ symbol: trade.s });
    if (!Ticker) return console.log("Ticker not found");
    if (Ticker.running === false) return console.log("Ticker is Off ");
    const buyPrice = sellPrice - (sellPrice * Ticker.buyPercentage) / 100;
    console.log(symbol, quantity, buyPrice);

    const pendingOrders = await Trades.find({
      Symbol: trade.s,
      sellPrice: { $exists: false },
    });
    // console.log(pendingOrders, "pendingOrders");
    if (pendingOrders.length === 0) {
      await binance.futuresMarketBuy(symbol, quantity);
    } else {
      await binance.futuresBuy(
        symbol,
        quantity,
        buyPrice.toFixed(Ticker?.fixed)
      );

      // await binance.futuresCancelAll(symbol)
    }

    console.log('closed event emitted')
    myEmitter.emit('clsoedTrade',symbol)
  } catch (error) {
    console.log(error?.message);
    // console.log("Failed to create limit sell order");

    return;
  }
});

myEmitter.on("clsoedTrade" ,async(symbol)=>{
  try {
    const { binance } = require("../binanceConnect");
    let  opentrades = await binance.futuresOpenOrders(symbol);
    opentrades = opentrades.filter((trade) => trade.side === "BUY").sort((a, b) => a.price - b.price);
    if(opentrades.length <= 1) return;
    //remove last trade
    opentrades.pop();
    // console.log(opentrades);
    for(let trade of opentrades){
      await binance.futuresCancel(symbol,{orderId:trade.orderId})
      
    }
    
  } catch (error) {
    console.log(error.message)
    
  }

})

module.exports = myEmitter;
