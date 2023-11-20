const express = require('express')
const Ticker = require('../Model/tickers.model')
const TickerRouter =express.Router()

TickerRouter.get('/',async(req,res)=>{
    try {
    
        const tickers = await Ticker.find({})
      
        return res.status(200).send(tickers)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
        
    }
})

TickerRouter.patch('/update',async(req,res)=>{
    try {
        const {symbol,quantity,buyPercentage,sellPercentage,running,fixed,_id} = req.body
        if(!_id) return res.status(400).send('Please provide id')
        if(!symbol) return res.status(400).send('Please provide symbol')
        if(!quantity) return res.status(400).send('Please provide quantity')
        if(!buyPercentage) return res.status(400).send('Please provide buyPercentage')
        if(!sellPercentage) return res.status(400).send('Please provide sellPercentage')
        if(!running) return res.status(400).send('Please provide running')
        // if(!fixed) return res.status(400).send('Please provide fixed')

        console.log(req.body)
        const ticker = await Ticker.findByIdAndUpdate(_id,{
            symbol,
            quantity,
            buyPercentage,
            sellPercentage,
            running,
            fixed
        },{new:true})

        return res.status(200).send(ticker)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
        
    }
}
)

module.exports =TickerRouter


