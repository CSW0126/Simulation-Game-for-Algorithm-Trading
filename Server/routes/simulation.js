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
                    result = Martingale(body.data, historicalData, body.data.type)


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

const Martingale = (rules, historicalData, assetsType) =>{
    try{
        const useAtt = 'c' //close

        //by rules object
        const upperPrice = (rules.price_range_up == 0 ? 2** 256 : rules.price_range_up)
        const lowerPrice = rules.price_range_bot
        const takeProfitRatio = rules.take_profit
        const stopLoss = rules.stop_loss
        const stopEarn = rules.stop_earn
        const buyParam = rules.priceScaleData
        const initInvestment = rules.investment

        let holdingUSD = rules.investment
        let holdingShares = 0
        let entryPrice = 0
        let round = 0
        let record = []
        let totalShares = 0
        let entryInvestment = 0
        let buyParamList = []
 
        //if is crypto, calculate the share value according to investment
        //if is stock, each share value should equal to current price of 1 share
        let eachShareValue = 0
        if(assetsType == 1){
            //cal total shares
            for(let i in buyParam){
                totalShares += buyParam[i].share
            }
            eachShareValue = holdingUSD / totalShares  
        }


        //for each day
        for(let i in historicalData){
            const currentPrice = Number(historicalData[i][useAtt])
            let profitRatio = 0

            //for stock
            if (assetsType == 2){
                eachShareValue = currentPrice
            } 

            //check holding
            if(holdingShares == 0){
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
                //for each buy param
                for(let j in buyParam){
                    let param = buyParam[j]
                    let shares = param.share
                    let cost = eachShareValue * shares
 
                    //calculate drawback value to find out buy price of each buy param 
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
                        let getShares = 0 
                        
                        //calculate the share will get
                        if (assetsType == 1){
                            getShares = cost/currentPrice
                        }else if (assetsType == 2){
                            getShares = shares
                        }
                        
                        
                        holdingShares += getShares
                        holdingUSD -= cost
                        entryPrice = currentPrice
                        let holdingAvg = getShares * buyPrice / holdingShares
                        if(holdingUSD < 0) holdingUSD = 0

                        let recordData = {
                            round,
                            time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                            entryPrice,
                            order:"Buy",
                            currentPrice,
                            executePrice: buyPrice,
                            cost,
                            getShares,
                            holdingShares,
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
                let sharesValueInUSD = holdingShares * currentPrice
                profitRatio = (-(1-((holdingUSD+sharesValueInUSD)/initInvestment))) *100

                //update avg price
                let avgPrice = 0
                for(let j in record){
                    if(record[j].round == round){
                        //total cost of shares , execute Price * shares
                        avgPrice += record[j].getShares * record[j].executePrice
                    }
                }
                avgPrice /= holdingShares

                //check stop loss
                if(profitRatio <= -stopLoss){
                    console.log("STOP LOSS")
                    //sell all holding shares
                    let sellValue = holdingShares * currentPrice;
                    holdingUSD += sellValue;
                    holdingShares = 0;
                    let recordData = {
                        round,
                        time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                        entryPrice,
                        entryInvestment,
                        order: "Sell",
                        currentPrice,
                        executePrice: currentPrice,
                        sellValue,
                        holdingShares,
                        holdingUSD,
                        holdingAvg: avgPrice
                    };

                    record.push(recordData)

                    //update each share value
                    if (assetsType == 1){
                        eachShareValue = holdingUSD / totalShares
                    }

                    //update round
                    round ++
                    buyParamList = []
                    break
                }

                //check stop earn
                if(profitRatio >= stopEarn && stopEarn != 0){
                    console.log("STOP Earn")
                    //sell all holding shares
                    let sellValue = holdingShares * currentPrice;
                    holdingUSD += sellValue;
                    holdingShares = 0;
                    let recordData = {
                        round,
                        time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                        entryPrice,
                        entryInvestment,
                        order: "Sell",
                        currentPrice,
                        executePrice: currentPrice,
                        sellValue,
                        holdingShares,
                        holdingUSD,
                        holdingAvg: avgPrice
                    };

                    record.push(recordData)
                    //update each share value
                    if(assetsType == 1){
                        eachShareValue = holdingUSD /totalShares 
                    }

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
                    let sellValue = holdingShares * currentPrice;
                    holdingUSD += sellValue;
                    holdingShares = 0;
                    let recordData = {
                        round,
                        time: moment(historicalData[i].t).format("YYYY-MM-DD"),
                        entryPrice,
                        entryInvestment,
                        order: "Sell",
                        currentPrice,
                        executePrice: currentPrice,
                        sellValue,
                        holdingShares,
                        holdingUSD,
                        holdingAvg: avgPrice
                    };

                    record.push(recordData)

                    //update each share value
                    if(assetsType == 1){
                        eachShareValue = holdingUSD / totalShares
                    }

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
                        let getShares = assetsType == 1 ? (cost/currentPrice) : assetsType == 2 ? (buyParamList[j].shares) : 0
                        let holdingAvg = ((holdingShares * avgPrice) + (getShares * currentPrice)) / (holdingShares+getShares)

                        holdingShares += getShares
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
                            getShares,
                            holdingShares,
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
    // https://dcacryptocalculator.com/bitcoin?start_date=2020-12-19&finish_date=2023-02-27&regular_investment=1&currency_code=USD&investment_interval=daily&exchange_fee=0
    try{
        const useAtt = 'c' //close

        //DCA rules
        const period = rules.period
        const DCAInvestAmount = rules.DCAInvestAmount
        const validDate = rules.validDate
        // const stop_earn = rules.stop_earn
        // const stop_loss = rules.stop_loss
        const type = rules.type

        let usingUSD = 0
        let holdingShare = 0
        let getShares = 0
        let round = 0
        let record = []

        for (let i in historicalData){
            let order = "None"

            const currentPrice = Number(historicalData[i][useAtt])

            //calculate stop earn
            let sharesValueInUSD = holdingShare * currentPrice
            let profitRatio = 0
            if (usingUSD != 0){
                profitRatio = (-(1-((sharesValueInUSD)/usingUSD))) *100
            }

            
            // if(stop_earn != 0 && stop_earn >= profitRatio){
            //     console.log("Stop Earn")
            //     round += 1
            //     //sell
            //     order = "Sell"
            // }

            // //calculate stop loss
            // //sell
            // if(profitRatio <= -stop_loss){
            //     console.log("STOP LOSS")
            //     round += 1
            //     //sell
            //     order = "Sell"
            // }


            if((Number(i) % period) === 0 ){
                //buy
                order = "Buy"
                if(type == 1){
                    //buy with same USD
                    usingUSD += DCAInvestAmount
                    getShares = (DCAInvestAmount/currentPrice)
                    holdingShare += (DCAInvestAmount/currentPrice)
                }else if (type == 2){
                    //buy according to shares value
                    usingUSD += (DCAInvestAmount * currentPrice)
                    holdingShare += DCAInvestAmount
                    getShares = DCAInvestAmount
                }

                round += 1
            }

            //update holding
            sharesValueInUSD = holdingShare * currentPrice

            let recordData = {
                round,
                time: historicalData[i].t,
                order,
                currentPrice,
                sharesValueInUSD,
                profitRatio,
                usingUSD,
                holdingShare,
                getShares
            };

            record.push(recordData)
        }

        return record



        // let period = rules.
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
