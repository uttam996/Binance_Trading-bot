const {APIKEY,APISECRET,} = require('./env')
const axios = require("axios");
const WebSocket = require("ws");
const Binance = require('node-binance-api');
const myEmitter = require('./events/TradeEvent');
const binance = new Binance().options({
  APIKEY: APIKEY,
  APISECRET: APISECRET,
  family: 4,
});
console.log(APIKEY)
const sync = async () => {
  let listenerKey = "";
  // const APIKEY = APIKEY
  // const APISECRET = APISECRET

  const getListenerkey = async () => {
    try {
      const { data } = await axios.post("https://fapi.binance.com/fapi/v1/listenKey", null, {
        headers: {
         "X-MBX-APIKEY": APIKEY,
        },
       });
       listenerKey = data.listenKey;
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.message);
    }
  };

  await getListenerkey();

  if (listenerKey === "") {
    console.log("listenerKey is empty");
    return;
  }

  const ws = new WebSocket("wss://fstream.binance.com/ws/" + listenerKey);

  ws.on("open", function open() {
    console.log("connected");
    // console.log(mygrid)
  });


  ws.on("message", async function incoming(data) {

    // console.log(data);
    const parsedData = JSON.parse(data.toString());    

    if (parsedData.e === "ACCOUNT_CONFIG_UPDATE") {
      // update account settings
     } else if (parsedData.e === "ORDER_TRADE_UPDATE") {
      let trade = parsedData.o;
      // console.log(trade)
  
      // if (trade.x === "NEW") {
      //  addOpenOrder(trade.s, trade.i + "", trade.p, trade.S.toLowerCase());
      // } else if (trade.x === "CANCELED") {
      //  deleteOpenOrder(trade.s, trade.i + "");
      // } else if (trade.x === "REJECTED") {
      //  deleteOpenOrder(trade.s, trade.i + "");
      // } else if (trade.x === "TRADE") {
      //  deleteOpenOrder(trade.s, trade.i + "");
      // }
  
      if (trade.x === "TRADE" && trade.X === "FILLED") {
       if (trade.S === "BUY") {
        myEmitter.emit('buyHandler',trade)
       
       } else if (trade.S === "SELL") {
        myEmitter.emit('SellHandler',trade)

        // await sellHandler(trade);
      
       }
      }
      }
  }
  );

  const intervalId = setInterval(() => {
    ws.close();
   }, 1000 * 60 * 30);
  
   ws.on("close", () => {
    console.log("Binace WebSocket Disconnected", new Date().toLocaleString());
    clearInterval(intervalId);
    sync();
   });
    // console.log(mygrid)
  
  
};






// export binance here 
module.exports = {binance,sync};

