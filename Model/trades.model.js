const {model, Schema} = require('mongoose');

const trades = new Schema({
    Symbol: {
        type: String,
        required: true,
    },
    buyPrice: {
        type: Number,
        required: true,
    },
    sellPrice: {
        type: Number,
        required: false,
    },
    buyQuantity: {
        type: Number,
        required: true,
    },
    sellQuantity: {
        type: Number,
        required: false,
    },
  

}, {timestamps: true});

const Trades = model('Trades', trades);

module.exports = Trades;
