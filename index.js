const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {binance,sync} = require('./binanceConnect');
const { DBURL } = require('./env');
const { calcuratePercentage } = require('./utility/helpers');
const TickerRouter = require('./Routes/tickers.route');
const morgan = require('morgan')
const cors =require('cors');
const OrderRouter = require('./Routes/orders.route');



app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/tickers',TickerRouter)
app.use('/order',OrderRouter)

app.listen(process.env.PORT, () => {
    console.log('Example app listening on port 3000!');
});


mongoose.connect(DBURL)
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(DBURL)
        console.log(err);
    });



calcuratePercentage(100, 10,)
sync();





