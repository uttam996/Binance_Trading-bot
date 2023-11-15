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
                               
                                { $multiply: [ "$sellPrice", "$buyQuantity" ] },
                                { $multiply: [ "$buyPrice", "$buyQuantity" ] },

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

const pendingOrders =async ()=>{
    try {
        const pending = await Trades.find({
            sellPrice:{
                $ne:null
            }
        })

        let profit=0
        pending.forEach((el)=>{
            profit +=   el.sellPrice*el.sellQuantity-el.buyPrice*el.buyQuantity  

        })

        console.log(pending)
        console.log(profit)
        
    } catch (error) {
        console.log(error)
        
    }

}
pendingOrders()



module.exports =OrderRouter