const express = require('express')
const Trades = require('../Model/trades.model')
const OrderRouter =express.Router()

OrderRouter.get('/',async(req,res)=>{
    try {
        const order = await Trades.find({})
        
        return res.send(order) 

    } catch (error) {
        return res.send(error.message)
        
    }
})

OrderRouter.get('/profit',async(req,res)=>{
    try {
        const profit = await Trades.aggregate([
            {
                $group:{
                    _id:null,
                    totalProfit:{
                        $sum:{
                            $subtract:[
                                { $multiply: [ "$buyPrice", "$buyQuantity" ] },
                                { $multiply: [ "$sellPrice", "$buyQuantity" ] },

                            ]
                        }
                    
                    }
                }
            }
        ])

        return res.send(profit)
        
    } catch (error) {
        return res.send(error.message)
        
    }

})



module.exports =OrderRouter