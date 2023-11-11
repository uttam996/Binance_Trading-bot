
const {model,Schema} = require('mongoose');

const tickerSchema = new Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    },
    buyPercentage: {
        type: Number,
        required: true
    },
    sellPercentage: {
        type: Number,
        required: true
    },
    running:{
        type:Boolean,
        default:false
    },
    fixed:{
        type:Number,
        default:0
    }

});


const Ticker = model('Ticker', tickerSchema);

module.exports = Ticker;