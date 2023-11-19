const express = require('express')
const Trades = require('../Model/trades.model')
const OrderRouter =express.Router()



OrderRouter.get('/profit', async (req, res) => {
    try {
        // get profit of today and all time
        const profit = await Trades.aggregate([
            {
                $match: {
                    sellPrice: {
                        $ne: null
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    Alltime: {
                        $sum: {
                            $subtract: [
                                { $multiply: ["$sellPrice", "$sellQuantity"] },
                                { $multiply: ["$buyPrice", "$buyQuantity"] }
                            ]
                        }
                    },
                    today: {
                        $sum: {
                            $cond: [
                                { $gte: ["$createdAt", new Date(new Date().setHours(0, 0, 0, 0))] },
                                {
                                    $subtract: [
                                        { $multiply: ["$sellPrice", "$sellQuantity"] },
                                        { $multiply: ["$buyPrice", "$buyQuantity"] }
                                    ]
                                },
                                0
                            ]
                        }
                    }
                }
            }
        ])
        return res.status(200).send(profit[0])

    } catch (error) {
        return res.send(error.message)

    }

})

OrderRouter.get('/open', async (req, res) => {
    try {
        const open = await Trades.find({
            sellPrice: null
        })
        return res.send(open)

    
        // handle today endpoint logic here
        

    } catch (error) {
        return res.send(error.message)

    }

})

OrderRouter.get('/completed',async(req,res)=>{
    try {
        const completed = await Trades.find({
            sellPrice:{
                $ne:null
            }
        })
        return res.send(completed)
        
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
// pendingOrders()



module.exports =OrderRouter