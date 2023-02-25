const express = require('express')
const router = express.Router()
const AuthToken = require('../auth/check-token')
const axios = require('axios').default;
const fs = require('fs')
const moment = require('moment')
const User = require('../models/user')

/* do simulation
URL:localhost:3000//simulation/
Method: POST
body:
{
    token: xxx,
    type: 1,
    algoType: 1,
    ... (rule object with token) 
}
*/
router.post('/',AuthToken, async(req,res)=>{
    try{
        username = req.username
        _id = req._id
        body = req.body
        console.log(body)
        let historicalData = null
        //check type + get historical data
        if(body.data.type == 1){
            //crypto
            historicalData = getHisData(body.data.pair, body.data.rangeDate, 1)
            // console.log(historicalData)
        }else if(body.data.type == 2){
            //stock
            historicalData = getHisData(body.data.pair, body.data.rangeDate, 2)
        }

        //get historical data
        let result = null
        if(historicalData){
            //check algo use
            switch(body.data.algoType){
                case 1: 
                    //martingale
                    //apply algo
                    // console.log(body.data.type)
                    if(body.data.type == 1){
                        result = Martingale(body.data, historicalData)
                    }else if(body.data.type == 2){
                        // result = Martingale(body.data, historicalData)
                        result = MartingaleForStock(body.data, historicalData)
                    }

                    if(!result) throw "Rule error"
                    if(body.data.saveUser){
                        let saveUser = await SaveUser(body, _id)
                        console.log(saveUser)
                        if (saveUser){
                            return res.status(200).json({
                                status: "success",
                                message: result,
                                user:saveUser
                            })
                        }else{
                            return res.status(200).json({
                                status: "success",
                                message: result,
                                user: null
    
                            })
                        }
                    }else{
                        return res.status(200).json({
                            status: "success",
                            message: result,
                        })
                    }
                case 2:
                    //DCA
                    //apply algo
                    result = DCA(body.data, historicalData)
                    if(!result) throw "Rule error"
                    return res.status(200).json({
                        status: "success",
                        message: "TODO (DCA)"
                       })
                    
                case 3:
                    //custom Indicator
                    //apply algo
                    result = CustomIndicator(body.data, historicalData)
                    if(!result) throw "Rule error"
                    return res.status(200).json({
                        status: "success",
                        message: "TODO (custom Indicator)"
                       })
                    
                default:
                    return res.status(200).json({
                        status: "fail",
                        message: "AlgoType error"
                    })
            }
        }else{
            return res.status(200).json({
                status: "fail",
                message: "Ticker error"
            })
        }

    }catch(e){
        console.log(e)
        return res.status(200).json({
            status: "fail",
            message: e
        })
    }
})

const getHisData = (ticker, dateRange, type) =>{
    try{
        console.log(ticker)
        console.log(moment(dateRange[0]).valueOf())
        console.log(moment(dateRange[1]).valueOf())

        var filename = ""
        if (type == 1){
            filename =  (ticker).slice(2)
        }else if(type == 2){
            filename = ticker
        }
        var path = `HisData/${filename}.json`
        if (fs.existsSync(path)){
            let readData = fs.readFileSync(path)
            let oldJsonData = JSON.parse(readData)
            let beginIndex = -1
            let endIndex = -1
            oldJsonData.results.every((value, i) => {
                if(moment(value.t).format("YYYY-MM-DD") == moment(dateRange[0]).format("YYYY-MM-DD")){
                    beginIndex = i
                }
                if (moment(value.t).format("YYYY-MM-DD") == moment(dateRange[1]).format("YYYY-MM-DD")){
                    endIndex = i
                }

                if( beginIndex != -1 && endIndex != -1){
                    return false
                }else{
                    return true
                }
            });

            console.log([beginIndex,endIndex])
            let finalData = oldJsonData.results.slice(beginIndex,endIndex+1)
            // console.log(finalData[0].t)
            // console.log(finalData[finalData.length-1].t)
            // console.log(finalData.length)
            return finalData
        }else{
            console.log("file not exists")
            return null
        }
    }catch(err){
        console.log(err)
        return null
    }
}

const SaveUser = async(body, _id ) =>{
    try{
        body.data.recordTime = new Date()
        let request_user = {
                _id,
                $push:{record:body.data}
            }

        //EDIT
        let user = await User.findById(request_user._id).exec()
        if(!user){
            //user not exist
            console.log("!user")
            return false
        }

        let updatedUser = await  User.findByIdAndUpdate(request_user._id, request_user, { new: true }).exec()
        if(updatedUser){
            updatedUser.password = undefined
            return updatedUser
        }

        return false
    }catch(err){
        console.log(err)
        return false
    }
}
const MartingaleForStock = (rules, historicalData) =>{
    try{
        let useAtt = 'c' //close
        let upperPrice = rules.price_range_up
        if(upperPrice == 0) upperPrice = 2 ** 256
        let lowerPrice = rules.price_range_bot
        let takeProfitRatio = rules.take_profit
        let stopLoss = rules.stop_loss
        let stopEarn = rules.stop_earn
        let buyParam = rules.priceScaleData
        let initInvestment = rules.investment
        let holdingUSD = rules.investment
        let holdingCoin = 0
        let entryPrice = 0
        let round = 0
        let record = []
        let totalShares = 0
        let entryInvestment = 0
        let buyParamList = []

        for(let i in historicalData){
            const currentPrice = Number(historicalData[i][useAtt])
            let profitRatio = 0

            //looking for first buy option
            //next action can only be BUY
            if (holdingCoin == 0){
                //cal profitRatio
                profitRatio = (-(1-(holdingUSD/initInvestment))) *100
                //check stop loss
                if(profitRatio <= -stopLoss){
                    console.log("STOP LOSS")
                    break
                }

                //check stop earn
                if(profitRatio >= stopEarn && stopEarn != 0){
                    console.log("STOP Earn")
                    break
                }

                //check in range
                if(currentPrice >= upperPrice || currentPrice <= lowerPrice){
                    //console.log("Not in Range")
                    continue
                }

                //buy parameter, always start in 0 if holding = 0
                for(let j in buyParam){
                    let param = buyParam[j]
                    let shares = param.share
                    // let cost = eachShareValue * shares
    
                    //total drawback
                    let totalD = 1
                    for(let k = 0; k < j; k++){
                        totalD *= ((100 - buyParam[k+1].priceScale)/100)
                    }
                    totalD = (1- totalD) * 100
                    let buyPrice = currentPrice * (1-(totalD/100))

                    let obj = {
                        index:j,
                        creation:currentPrice,
                        buyPrice:buyPrice,
                        ratio:totalD,
                        shares,
                        executed: false
                    }

                    //check buy
                    if(currentPrice <= obj.buyPrice){
                        entryInvestment = holdingUSD
                        //execute BUY option in current price, update holding coin and USD
                        
                        let getCoin = buyParam[j].share
                        let cost = getCoin*currentPrice
                        holdingCoin += getCoin
                        holdingUSD -= getCoin * currentPrice
                        entryPrice = currentPrice
                        let holdingAvg = getCoin * buyPrice / holdingCoin
                        if(holdingUSD < 0) holdingUSD = 0

                        let recordData = {
                            round,
                            time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                            entryPrice,
                            order:"Buy",
                            currentPrice,
                            executePrice: buyPrice,
                            cost,
                            getCoin,
                            holdingCoin,
                            holdingUSD,
                            holdingAvg
                        }
                        // console.log(recordData)
                        obj.executed = true
                        record.push(recordData)
                    }
                    buyParamList.push(obj)
                }
            }else{
                //next action sell or buy 
                //cal profitRatio
                let coinValueInUSD = holdingCoin * currentPrice
                profitRatio = (-(1-((holdingUSD+coinValueInUSD)/initInvestment))) *100
                //update avg price
                let avgPrice = 0
                for(let j in record){
                    if(record[j].round == round){
                        //total cost of coin , execute Price * coin
                        avgPrice += record[j].getCoin * record[j].executePrice
                    }
                }
                avgPrice /= holdingCoin

                //check stop loss
                if(profitRatio <= -stopLoss){
                    console.log("STOP LOSS")
                    //sell all holding coin
                    let sellValue = holdingCoin * currentPrice
                    holdingUSD += sellValue
                    holdingCoin = 0
                    let recordData = {
                        round,
                        time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                        entryPrice,
                        entryInvestment,
                        order:"Sell",
                        currentPrice,
                        executePrice: currentPrice,
                        sellValue,
                        holdingCoin,
                        holdingUSD,
                        holdingAvg: avgPrice
                    }

                    record.push(recordData)
                    //update each share value
                    eachShareValue = holdingUSD * 1/totalShares
                    //update round
                    round ++
                    buyParamList = []
                    break
                }

                //check stop earn
                if(profitRatio >= stopEarn && stopEarn != 0){
                    console.log("STOP Earn")
                    //sell all holding coin
                    let sellValue = holdingCoin * currentPrice
                    holdingUSD += sellValue
                    holdingCoin = 0
                    let recordData = {
                        round,
                        time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                        entryPrice,
                        entryInvestment,
                        order:"Sell",
                        currentPrice,
                        executePrice: currentPrice,
                        sellValue,
                        holdingCoin,
                        holdingUSD,
                        holdingAvg: avgPrice
                    }

                    record.push(recordData)
                    //update each share value
                    eachShareValue = holdingUSD * 1/totalShares
                    //update round
                    round ++
                    buyParamList = []
                    break
                }

                //calculate the sell price according to take profit ratio
                let sellForProfitPrice = avgPrice * (1+(takeProfitRatio/100))

                //if going up and pass the sell price, take profit (sell)
                if(currentPrice >= sellForProfitPrice){
                    //sell and end this round
                    let sellValue = holdingCoin * currentPrice
                    holdingUSD += sellValue
                    holdingCoin = 0

                    let recordData = {
                        round,
                        time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                        entryPrice,
                        entryInvestment,
                        order:"Sell",
                        currentPrice,
                        executePrice: currentPrice,
                        sellValue,
                        holdingCoin,
                        holdingUSD,
                        holdingAvg: avgPrice
                    }

                    record.push(recordData)

                    //update each share value
                    eachShareValue = holdingUSD * 1/totalShares
                    //update round
                    round ++
                    buyParamList = []
                    continue
                }

                //check in range, no buy order
                if(currentPrice >= upperPrice || currentPrice <= lowerPrice){
                    //console.log("Not in Range")
                    continue
                }

                //if going down, check if need to execute Buy
                // console.log(buyParamList)
                for(let j in buyParamList){
                    //pass if executed
                    // console.log(buyParamList[j].executed)
                    
                    if(buyParamList[j].executed) continue
                    
                    if(currentPrice <= buyParamList[j].buyPrice){
                        //buy in current
                        let cost = currentPrice * buyParamList[j].shares
                        let getCoin = buyParamList[j].shares
                        let holdingAvg = ((holdingCoin * avgPrice) + (getCoin * currentPrice)) / (holdingCoin+getCoin)

                        holdingCoin += getCoin
                        holdingUSD -= buyParamList[j].shares * currentPrice

                        if(holdingUSD < 0) holdingUSD = 0

                        let recordData = {
                            round,
                            time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                            entryPrice,
                            order:"Buy",
                            currentPrice,
                            executePrice: currentPrice,
                            cost,
                            getCoin,
                            holdingCoin,
                            holdingUSD,
                            holdingAvg

                        }
                        buyParamList[j].executed = true
                        record.push(recordData)
                    }
                }
            }
        }
        console.log("hi")
        console.log(record)
        return record
    }catch(err){
        console.log(err)
        return null
    }
}

const Martingale = (rules, historicalData) =>{
    try{
        let useAtt = 'c' //close
        let upperPrice = rules.price_range_up
        if(upperPrice == 0) upperPrice = 2 ** 256
        let lowerPrice = rules.price_range_bot
        let takeProfitRatio = rules.take_profit
        let stopLoss = rules.stop_loss
        let stopEarn = rules.stop_earn
        let buyParam = rules.priceScaleData
        let initInvestment = rules.investment
        let holdingUSD = rules.investment
        let holdingCoin = 0
        let entryPrice = 0
        let round = 0
        let record = []
        let totalShares = 0
        let entryInvestment = 0
 
        //cal total shares
        for(let i in buyParam){
            totalShares += buyParam[i].share
        }
        let eachShareValue = holdingUSD / totalShares
        let buyParamList = []
        for(let i in historicalData){
            const currentPrice = Number(historicalData[i][useAtt])
            let profitRatio = 0
            // console.log(buyParamList)

            //check holding
            if(holdingCoin == 0){
                //next action can only be BUY

                //cal profitRatio
                profitRatio = (-(1-(holdingUSD/initInvestment))) *100
                //check stop loss
                if(profitRatio <= -stopLoss){
                    console.log("STOP LOSS")
                    break
                }

                //check stop earn
                if(profitRatio >= stopEarn && stopEarn != 0){
                    console.log("STOP Earn")
                    break
                }

                //check in range
                if(currentPrice >= upperPrice || currentPrice <= lowerPrice){
                    //console.log("Not in Range")
                    continue
                }

                //buy parameter, always start in 0 if holding = 0
                for(let j in buyParam){
                    let param = buyParam[j]
                    let shares = param.share
                    let cost = eachShareValue * shares
 
                    let totalD = 1
                    for(let k = 0; k < j; k++){
                        totalD *= ((100 - buyParam[k+1].priceScale)/100)
                    }
                    totalD = (1- totalD) * 100
                    let buyPrice = currentPrice * (1-(totalD/100))

                    let obj = {
                        index:j,
                        creation:currentPrice,
                        buyPrice:buyPrice,
                        ratio:totalD,
                        shares,
                        executed: false
                    }

                    //check buy
                    if(currentPrice <= obj.buyPrice){
                        entryInvestment = holdingUSD
                        //execute BUY option in current price, update holding coin and USD
                        let getCoin = cost/currentPrice
                        holdingCoin += getCoin
                        holdingUSD -= cost
                        entryPrice = currentPrice
                        let holdingAvg = getCoin * buyPrice / holdingCoin
                        if(holdingUSD < 0) holdingUSD = 0

                        let recordData = {
                            round,
                            time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                            entryPrice,
                            order:"Buy",
                            currentPrice,
                            executePrice: buyPrice,
                            cost,
                            getCoin,
                            holdingCoin,
                            holdingUSD,
                            holdingAvg
                        }
                        // console.log(recordData)
                        obj.executed = true
                        record.push(recordData)
                    }
                    buyParamList.push(obj)
                }
                //console.log(buyParamList)
                
            }else{
                //next action sell or buy 
                //cal profitRatio
                let coinValueInUSD = holdingCoin * currentPrice
                profitRatio = (-(1-((holdingUSD+coinValueInUSD)/initInvestment))) *100
                //update avg price
                let avgPrice = 0
                for(let j in record){
                    if(record[j].round == round){
                        //total cost of coin , execute Price * coin
                        avgPrice += record[j].getCoin * record[j].executePrice
                    }
                }
                avgPrice /= holdingCoin

                //check stop loss
                if(profitRatio <= -stopLoss){
                    console.log("STOP LOSS")
                    //sell all holding coin
                    let sellValue = holdingCoin * currentPrice
                    holdingUSD += sellValue
                    holdingCoin = 0
                    let recordData = {
                        round,
                        time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                        entryPrice,
                        entryInvestment,
                        order:"Sell",
                        currentPrice,
                        executePrice: currentPrice,
                        sellValue,
                        holdingCoin,
                        holdingUSD,
                        holdingAvg: avgPrice
                    }

                    record.push(recordData)
                    //update each share value
                    eachShareValue = holdingUSD * 1/totalShares
                    //update round
                    round ++
                    buyParamList = []
                    break
                }

                //check stop earn
                if(profitRatio >= stopEarn && stopEarn != 0){
                    console.log("STOP Earn")
                    //sell all holding coin
                    let sellValue = holdingCoin * currentPrice
                    holdingUSD += sellValue
                    holdingCoin = 0
                    let recordData = {
                        round,
                        time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                        entryPrice,
                        entryInvestment,
                        order:"Sell",
                        currentPrice,
                        executePrice: currentPrice,
                        sellValue,
                        holdingCoin,
                        holdingUSD,
                        holdingAvg: avgPrice
                    }

                    record.push(recordData)
                    //update each share value
                    eachShareValue = holdingUSD * 1/totalShares
                    //update round
                    round ++
                    buyParamList = []
                    break
                }

                //calculate the sell price according to take profit ratio
                let sellForProfitPrice = avgPrice * (1+(takeProfitRatio/100))

                //if going up and pass the sell price, take profit (sell)
                if(currentPrice >= sellForProfitPrice){
                    //sell and end this round
                    let sellValue = holdingCoin * currentPrice
                    holdingUSD += sellValue
                    holdingCoin = 0

                    let recordData = {
                        round,
                        time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                        entryPrice,
                        entryInvestment,
                        order:"Sell",
                        currentPrice,
                        executePrice: currentPrice,
                        sellValue,
                        holdingCoin,
                        holdingUSD,
                        holdingAvg: avgPrice
                    }

                    record.push(recordData)

                    //update each share value
                    eachShareValue = holdingUSD * 1/totalShares
                    //update round
                    round ++
                    buyParamList = []
                    continue
                }

                //check in range, no buy order
                if(currentPrice >= upperPrice || currentPrice <= lowerPrice){
                    //console.log("Not in Range")
                    continue
                }

                //if going down, check if need to execute Buy
                // console.log(buyParamList)
                for(let j in buyParamList){
                    //pass if executed
                    // console.log(buyParamList[j].executed)
                    
                    if(buyParamList[j].executed) continue
                    
                    if(currentPrice <= buyParamList[j].buyPrice){
                        //buy in current
                        let cost = eachShareValue * buyParamList[j].shares
                        let getCoin = cost/currentPrice
                        let holdingAvg = ((holdingCoin * avgPrice) + (getCoin * currentPrice)) / (holdingCoin+getCoin)

                        holdingCoin += getCoin
                        holdingUSD -= cost

                        if(holdingUSD < 0) holdingUSD = 0

                        let recordData = {
                            round,
                            time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                            entryPrice,
                            order:"Buy",
                            currentPrice,
                            executePrice: currentPrice,
                            cost,
                            getCoin,
                            holdingCoin,
                            holdingUSD,
                            holdingAvg

                        }
                        buyParamList[j].executed = true
                        record.push(recordData)
                    }
                }
            }
        };
        return record
    }catch(err){
        console.log(err)
        return null
    }
}

const DCA = (rules, historicalData) =>{
    try{

    }catch(err){
        console.log(err)
        return null
    }
}

const CustomIndicator = (rules, historicalData) =>{
    try{

    }catch(err){
        console.log(err)
        return null
    }
}


module.exports = router
