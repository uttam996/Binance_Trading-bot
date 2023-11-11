const express = require('express')
const Ticker = require('../Model/tickers.model')
const TickerRouter =express.Router()

TickerRouter.get('/',async(req,res)=>{
    try {
        console.log('hello')
        const tickers = await Ticker.find({})
      
        return res.send(tickers)
        
    } catch (error) {
        return res.send(error)
        
    }
})

module.exports =TickerRouter


