const express = require('express')
const router = express.Router()
const AuthToken = require('../auth/check-token')
const axios = require('axios').default;
const fs = require('fs')
const moment = require('moment')


/* get historical data (crypto)
URL:localhost:3000//his/getCryptoData
Method: POST
body:
{
    type: 1,
    ticker: 'X:DOGEUSD',
    from: '2020-12-19',
    to: '2022-12-19',
    token: xxx
}

if data not exists, get from API

(due to the API limitation, Data can only be obtained within 730 days at most,
but if there are already some old data, it will combine them and return more than 730 data to the web)
if latest date of the oldData is == today/yesterday, return oldData
if not, get newData from API and update the oldDate, return newData
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
            historicalData = getCryptoData(body.data.pair, body.data.rangeDate)
        }else{
            //stock
            //TODO
        }

        //get historical data
        let result = null
        if(historicalData){
            //check algo use
            switch(body.data.algoType){
                case 1: 
                    //martingale
                    //apply algo
                    result = Martingale(body.data, historicalData)
                    if(!result) throw "Rule error"
                    return res.status(200).json({
                        status: "success",
                        message: result
                       })
                    
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

const getCryptoData = (ticker, dateRange) =>{
    try{
        console.log(ticker)
        // console.log(moment(dateRange[0]).valueOf())
        // console.log(moment(dateRange[1]).valueOf())

        var filename = (ticker).slice(2)
        var path = `HisData/${filename}.json`
        if (fs.existsSync(path)){
            let readData = fs.readFileSync(path)
            let oldJsonData = JSON.parse(readData)
            let beginIndex = -1
            let endIndex = -1
            oldJsonData.results.every((value, i) => {
                if(value.t == moment(dateRange[0]).valueOf() && beginIndex == -1){
                    beginIndex = i
                }
                if (value.t == moment(dateRange[1]).valueOf() && endIndex == -1){
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

const SaveUser = async(body) =>{

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
        //cal total shares
        for(let i in buyParam){
            totalShares += buyParam[i].share
        }
        let eachShareValue = holdingUSD * 1/totalShares
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
                        order:"Sell",
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
                        order:"Sell",
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
                        order:"Sell",
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
