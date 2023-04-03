const express = require('express')
const router = express.Router()
const AuthToken = require('../auth/check-token')
const axios = require('axios').default;
const fs = require('fs')
const moment = require('moment')
const User = require('../models/user')
const {Martingale, DCA, CustomIndicator} = require('../component/helper')

/* do simulation
URL:localhost:3000/simulation/
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
        if(body.data.type == 1 && body.data.algoType != 3){
            //crypto
            historicalData = getHisData(body.data.pair, body.data.rangeDate, 1)
            // console.log(historicalData)
        }else if(body.data.type == 2 && body.data.algoType != 3){
            //stock
            historicalData = getHisData(body.data.pair, body.data.rangeDate, 2)
        }

        //get historical data
        let result = null
        if(historicalData || body.data.algoType == 3){
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
                    result = CustomIndicator(body.data)
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

/* get rank
URL:localhost:3000/simulation/getRank/
Method: POST
body:
{
    token: xxx
}
*/

router.post('/getRank', AuthToken, async(req,res)=>{
    try{
        //get all user recode where the algoType is 3
        let allUser = await User.find({record:{$elemMatch:{algoType:3}}})
        let allUserRank = []
        let rank = 1
        allUser.forEach((user)=>{
            user.record.forEach((record)=>{
                if(record.algoType == 3){
                    let result = CustomIndicator(record)
                    let finalInUSD = (result[result.length-1].holdingUSD + result[result.length-1].sharesValueInUSD).toFixed(2)
                    let lastDate = moment(result[result.length-1].time).format("YYYY-MM-DD")
                    let profitRatio = (((finalInUSD - record.investment)/record.investment)*100).toFixed(2)
                    allUserRank.push({
                        rank,
                        username: user.username,
                        record_id: record._id,
                        lastDate,
                        investment: record.investment,
                        finalInUSD,
                        profitRatio
                    })
                }
            })
        })


        allUserRank.sort((a,b)=>{
            return b.profitRatio - a.profitRatio
        })

        //add rank on each user in allUserRank
        allUserRank.forEach((user)=>{
            user.rank = rank
            rank++
        })


        return res.status(200).json({
            status: "success",
            message: allUserRank
        })
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

// const Martingale = (rules, historicalData, assetsType) =>{
//     try{
//         const useAtt = 'c' //close

//         //by rules object
//         const upperPrice = (rules.price_range_up == 0 ? 2** 256 : rules.price_range_up)
//         const lowerPrice = rules.price_range_bot
//         const takeProfitRatio = rules.take_profit
//         const stopLoss = rules.stop_loss
//         const stopEarn = rules.stop_earn
//         const buyParam = rules.priceScaleData
//         const initInvestment = rules.investment

//         let holdingUSD = rules.investment
//         let holdingShares = 0
//         let entryPrice = 0
//         let round = 0
//         let record = []
//         let totalShares = 0
//         let entryInvestment = 0
//         let buyParamList = []
 
//         //if is crypto, calculate the share value according to investment
//         //if is stock, each share value should equal to current price of 1 share
//         let eachShareValue = 0
//         if(assetsType == 1){
//             //cal total shares
//             for(let i in buyParam){
//                 totalShares += buyParam[i].share
//             }
//             eachShareValue = holdingUSD / totalShares  
//         }


//         //for each day
//         for(let i in historicalData){
//             const currentPrice = Number(historicalData[i][useAtt])
//             let profitRatio = 0

//             //for stock
//             if (assetsType == 2){
//                 eachShareValue = currentPrice
//             } 

//             //check holding
//             if(holdingShares == 0){
//                 //next action can only be BUY

//                 //cal profitRatio
//                 profitRatio = (-(1-(holdingUSD/initInvestment))) *100
//                 //check stop loss
                
//                 if(profitRatio <= -stopLoss){
//                     console.log("STOP LOSS")
//                     break
//                 }

//                 //check stop earn
//                 if(profitRatio >= stopEarn && stopEarn != 0){
//                     console.log("STOP Earn")
//                     break
//                 }

//                 //check in range
//                 if(currentPrice >= upperPrice || currentPrice <= lowerPrice){
//                     //console.log("Not in Range")
//                     continue
//                 }

//                 //buy parameter, always start in 0 if holding = 0
//                 //for each buy param
//                 for(let j in buyParam){
//                     let param = buyParam[j]
//                     let shares = param.share
//                     let cost = eachShareValue * shares
 
//                     //calculate drawback value to find out buy price of each buy param 
//                     let totalD = 1
//                     for(let k = 0; k < j; k++){
//                         totalD *= ((100 - buyParam[k+1].priceScale)/100)
//                     }
//                     totalD = (1- totalD) * 100
//                     let buyPrice = currentPrice * (1-(totalD/100))

//                     let obj = {
//                         index:j,
//                         creation:currentPrice,
//                         buyPrice:buyPrice,
//                         ratio:totalD,
//                         shares,
//                         executed: false
//                     }

//                     //check buy
//                     if(currentPrice <= obj.buyPrice){
//                         entryInvestment = holdingUSD
//                         //execute BUY option in current price, update holding coin and USD
//                         let getShares = 0 
                        
//                         //calculate the share will get
//                         if (assetsType == 1){
//                             getShares = cost/currentPrice
//                         }else if (assetsType == 2){
//                             getShares = shares
//                         }
                        
                        
//                         holdingShares += getShares
//                         holdingUSD -= cost
//                         entryPrice = currentPrice
//                         let holdingAvg = getShares * buyPrice / holdingShares
//                         if(holdingUSD < 0) holdingUSD = 0

//                         let recordData = {
//                             round,
//                             time: moment(historicalData[i].t).format("YYYY-MM-DD"),
//                             entryPrice,
//                             order:"Buy",
//                             currentPrice,
//                             executePrice: buyPrice,
//                             cost,
//                             getShares,
//                             holdingShares,
//                             holdingUSD,
//                             holdingAvg
//                         }
//                         // console.log(recordData)
//                         obj.executed = true
//                         record.push(recordData)
//                     }
//                     buyParamList.push(obj)
//                 }
//             }else{
//                 //next action sell or buy 
//                 //cal profitRatio
//                 let sharesValueInUSD = holdingShares * currentPrice
//                 profitRatio = (-(1-((holdingUSD+sharesValueInUSD)/initInvestment))) *100

//                 //update avg price
//                 let avgPrice = 0
//                 for(let j in record){
//                     if(record[j].round == round){
//                         //total cost of shares , execute Price * shares
//                         avgPrice += record[j].getShares * record[j].executePrice
//                     }
//                 }
//                 avgPrice /= holdingShares

//                 //check stop loss
//                 if(profitRatio <= -stopLoss){
//                     console.log("STOP LOSS")
//                     //sell all holding shares
//                     let sellValue = holdingShares * currentPrice;
//                     holdingUSD += sellValue;
//                     holdingShares = 0;
//                     let recordData = {
//                         round,
//                         time: moment(historicalData[i].t).format("YYYY-MM-DD"),
//                         entryPrice,
//                         entryInvestment,
//                         order: "Sell",
//                         currentPrice,
//                         executePrice: currentPrice,
//                         sellValue,
//                         holdingShares,
//                         holdingUSD,
//                         holdingAvg: avgPrice
//                     };

//                     record.push(recordData)

//                     //update each share value
//                     if (assetsType == 1){
//                         eachShareValue = holdingUSD / totalShares
//                     }

//                     //update round
//                     round ++
//                     buyParamList = []
//                     break
//                 }

//                 //check stop earn
//                 if(profitRatio >= stopEarn && stopEarn != 0){
//                     console.log("STOP Earn")
//                     //sell all holding shares
//                     let sellValue = holdingShares * currentPrice;
//                     holdingUSD += sellValue;
//                     holdingShares = 0;
//                     let recordData = {
//                         round,
//                         time: moment(historicalData[i].t).format("YYYY-MM-DD"),
//                         entryPrice,
//                         entryInvestment,
//                         order: "Sell",
//                         currentPrice,
//                         executePrice: currentPrice,
//                         sellValue,
//                         holdingShares,
//                         holdingUSD,
//                         holdingAvg: avgPrice
//                     };

//                     record.push(recordData)
//                     //update each share value
//                     if(assetsType == 1){
//                         eachShareValue = holdingUSD /totalShares 
//                     }

//                     //update round
//                     round ++
//                     buyParamList = []
//                     break
//                 }

//                 //calculate the sell price according to take profit ratio
//                 let sellForProfitPrice = avgPrice * (1+(takeProfitRatio/100))

//                 //if going up and pass the sell price, take profit (sell)
//                 if(currentPrice >= sellForProfitPrice){
//                     //sell and end this round
//                     let sellValue = holdingShares * currentPrice;
//                     holdingUSD += sellValue;
//                     holdingShares = 0;
//                     let recordData = {
//                         round,
//                         time: moment(historicalData[i].t).format("YYYY-MM-DD"),
//                         entryPrice,
//                         entryInvestment,
//                         order: "Sell",
//                         currentPrice,
//                         executePrice: currentPrice,
//                         sellValue,
//                         holdingShares,
//                         holdingUSD,
//                         holdingAvg: avgPrice
//                     };

//                     record.push(recordData)

//                     //update each share value
//                     if(assetsType == 1){
//                         eachShareValue = holdingUSD / totalShares
//                     }

//                     //update round
//                     round ++
//                     buyParamList = []
//                     continue
//                 }

//                 //check in range, no buy order
//                 if(currentPrice >= upperPrice || currentPrice <= lowerPrice){
//                     //console.log("Not in Range")
//                     continue
//                 }

//                 //if going down, check if need to execute Buy
//                 // console.log(buyParamList)
//                 for(let j in buyParamList){
//                     //pass if executed
//                     // console.log(buyParamList[j].executed)
                    
//                     if(buyParamList[j].executed) continue
                    
//                     if(currentPrice <= buyParamList[j].buyPrice){
//                         //buy in current
//                         let cost = eachShareValue * buyParamList[j].shares
//                         let getShares = assetsType == 1 ? (cost/currentPrice) : assetsType == 2 ? (buyParamList[j].shares) : 0
//                         let holdingAvg = ((holdingShares * avgPrice) + (getShares * currentPrice)) / (holdingShares+getShares)

//                         holdingShares += getShares
//                         holdingUSD -= cost

//                         if(holdingUSD < 0) holdingUSD = 0

//                         let recordData = {
//                             round,
//                             time: moment(historicalData[i].t).format("YYYY-MM-DD"),
//                             entryPrice,
//                             order:"Buy",
//                             currentPrice,
//                             executePrice: currentPrice,
//                             cost,
//                             getShares,
//                             holdingShares,
//                             holdingUSD,
//                             holdingAvg

//                         }
//                         buyParamList[j].executed = true
//                         record.push(recordData)
//                     }
//                 }
//             }
//         };
//         return record
//     }catch(err){
//         console.log(err)
//         return null
//     }
// }

// const DCA = (rules, historicalData) =>{
//     // https://dcacryptocalculator.com/bitcoin?start_date=2020-12-19&finish_date=2023-02-27&regular_investment=1&currency_code=USD&investment_interval=daily&exchange_fee=0
//     try{
//         const useAtt = 'c' //close

//         //DCA rules
//         const period = rules.period
//         const DCAInvestAmount = rules.DCAInvestAmount
//         const validDate = rules.validDate
//         // const stop_earn = rules.stop_earn
//         // const stop_loss = rules.stop_loss
//         const type = rules.type

//         let usingUSD = 0
//         let holdingShare = 0
//         let getShares = 0
//         let round = 0
//         let record = []

//         for (let i in historicalData){
//             let order = "None"

//             const currentPrice = Number(historicalData[i][useAtt])

//             //calculate stop earn
//             let sharesValueInUSD = holdingShare * currentPrice
//             let profitRatio = 0
//             if (usingUSD != 0){
//                 profitRatio = (-(1-((sharesValueInUSD)/usingUSD))) *100
//             }

            
//             // if(stop_earn != 0 && stop_earn >= profitRatio){
//             //     console.log("Stop Earn")
//             //     round += 1
//             //     //sell
//             //     order = "Sell"
//             // }

//             // //calculate stop loss
//             // //sell
//             // if(profitRatio <= -stop_loss){
//             //     console.log("STOP LOSS")
//             //     round += 1
//             //     //sell
//             //     order = "Sell"
//             // }


//             if((Number(i) % period) === 0 ){
//                 //buy
//                 order = "Buy"
//                 if(type == 1){
//                     //buy with same USD
//                     usingUSD += DCAInvestAmount
//                     getShares = (DCAInvestAmount/currentPrice)
//                     holdingShare += (DCAInvestAmount/currentPrice)
//                 }else if (type == 2){
//                     //buy according to shares value
//                     usingUSD += (DCAInvestAmount * currentPrice)
//                     holdingShare += DCAInvestAmount
//                     getShares = DCAInvestAmount
//                 }

//                 round += 1
//             }

//             //update holding
//             sharesValueInUSD = holdingShare * currentPrice

//             let recordData = {
//                 round,
//                 time: historicalData[i].t,
//                 order,
//                 currentPrice,
//                 sharesValueInUSD,
//                 profitRatio,
//                 usingUSD,
//                 holdingShare,
//                 getShares
//             };

//             record.push(recordData)
//         }

//         return record



//         // let period = rules.
//     }catch(err){
//         console.log(err)
//         return null
//     }
// }

// const CustomIndicator = (rules) =>{
//     try{
//         let historicalData = ProcessHisData(rules)

//         let buyGroup = rules.buyCondition
//         let sellGroup = rules.sellCondition

//         if(historicalData){

//             //prev price
//             historicalData = Prev(historicalData)

//             //moving average
//             let smaPeriods = GetPeriod(rules, "SMA")
//             for(let period of smaPeriods){
//                 historicalData = SMA(historicalData, period)
//             }

//             //RSI
//             let rsiPeriods = GetPeriod(rules, "RSI")
//             for (let period of rsiPeriods){
//                 historicalData = RSI(historicalData,period)
//             }

//             //Stochastic Oscillator
//             let soPeriods = GetPeriod(rules, "SO")
//             for(let period of soPeriods){
//                 historicalData = SO(historicalData, period)
//             }

//             //MACD
//             historicalData = MACD(historicalData)
//             historicalData = PrevMACD(historicalData)

//             //EMA
//             let EMAPeriod = GetPeriod(rules, "EMA")
//             if (EMAPeriod.includes(26)){
//                 let index = EMAPeriod.indexOf(26)
//                 EMAPeriod.splice(index, 1);
//             }

//             if(EMAPeriod.includes(12)){
//                 let index = EMAPeriod.indexOf(12)
//                 EMAPeriod.splice(index, 1)
//             }
            
//             for(let period of EMAPeriod){
//                 calculateEMA(historicalData,period)
//             }

//             //ADX
//             historicalData = ADX(historicalData)

//             const stopEarn = rules.stop_earn
//             const stopLoss = rules.stop_loss

//             let holdingUSD = rules.investment
//             let holdingShare = 0
//             let round = 0
//             let record = []
//             let initInvestment = 0
//             let usingUSD = 0
//             let sellingShare = 0

//             for (let dayData of historicalData){
//                 let order = "None"
//                 let recordData = {}
//                 if(holdingShare == 0){
//                     //check buy 
//                     let buyPass = true
//                     for(let group of buyGroup){
//                         // console.log(group)
//                         switch (group.type){
//                             case "And":
//                                 buyPass = ProcessAndGroup(dayData, group, "Buy")
//                                 break
//                             case "Not":
//                                 buyPass = ProcessNotGroup(dayData, group)
//                                 break
//                             case "Count":
//                                 buyPass = ProcessCountGroup(dayData, group, "Buy")
//                                 break
//                             default:
//                                 continue
//                         }

//                         if(!buyPass) break
//                     }

//                     if (buyPass){
//                         //execute buy
//                         order = "Buy"
//                         if(rules.type == 1){
//                             //crypto
//                             usingUSD = holdingUSD
//                             initInvestment = usingUSD
//                             holdingShare = holdingUSD/dayData.c
//                             holdingUSD = 0
//                         }else{
//                             //stock
//                             if(Math.floor(holdingUSD/dayData.c) == 0){
//                                 //cannot buy 1 shares
//                                 round -= 1
//                                 order = "None"
//                             }else{
//                                 holdingShare = Math.floor(holdingUSD/dayData.c)
//                                 holdingUSD = holdingUSD % dayData.c
//                                 usingUSD = dayData.c * holdingShare
//                                 initInvestment = usingUSD 
//                             }

//                         }

//                         sharesValueInUSD = holdingShare * dayData.c
                        
//                     }
//                 }else{
//                     //check stop earn + stop loss
//                     //calculate profit ratio
//                     let usdValue = holdingShare * dayData.c
//                     let profitRatio = (-(1-(usdValue/initInvestment))) *100
//                     if(profitRatio <= -stopLoss){
//                         // console.log("stop loss")
//                         order = "StopLoss"
//                         holdingUSD += holdingShare * dayData.c
//                         sellingShare = holdingShare
//                         sharesValueInUSD = 0
//                         holdingShare = 0
//                         usingUSD = 0
//                         recordData = {
//                             round,
//                             time: dayData.t,
//                             order,
//                             currentPrice: dayData.c,
//                             sharesValueInUSD : 0,
//                             holdingUSD,
//                             initInvestment,
//                             sellingShare
//                         };
//                         record.push(recordData)
//                         round += 1
//                         continue
//                     }

//                     if(profitRatio >= stopEarn && stopEarn != 0){
//                         // console.log("stopEarn")
//                         order = "StopEarn"
//                         holdingUSD += holdingShare * dayData.c
//                         sellingShare = holdingShare
//                         sharesValueInUSD = 0
//                         holdingShare = 0
//                         usingUSD = 0
//                         recordData = {
//                             round,
//                             time: dayData.t,
//                             order,
//                             currentPrice: dayData.c,
//                             sharesValueInUSD : 0,
//                             holdingUSD,
//                             initInvestment,
//                             sellingShare
//                         };
//                         record.push(recordData)
//                         round += 1
//                         continue
//                     }

//                     //check sell
//                     let sellPass = true
//                     for(let group of sellGroup){
//                         // console.log(group)
//                         switch (group.type){
//                             case "And":
//                                 sellPass = ProcessAndGroup(dayData, group, "Sell")
//                                 break
//                             case "Not":
//                                 sellPass = ProcessNotGroup(dayData, group)
//                                 break
//                             case "Count":
//                                 sellPass = ProcessCountGroup(dayData, group, "Sell")
//                                 break
//                             default:
//                                 continue
//                         }

//                         if(!sellPass) break
//                     }

//                     if (sellPass){
//                         //execute buy
//                         order = "Sell"
    
//                         holdingUSD += holdingShare * dayData.c
//                         sellingShare = holdingShare
//                         sharesValueInUSD = 0
//                         holdingShare = 0
//                         usingUSD = 0
//                     }
//                 }

//                 if(order == "Buy"){
//                     recordData = {
//                         round,
//                         time: dayData.t,
//                         order,
//                         currentPrice: dayData.c,
//                         sharesValueInUSD : holdingShare * dayData.c,
//                         usingUSD,
//                         holdingUSD,
//                         holdingShare
//                     };
//                 }else if(order == "Sell"){
//                     recordData = {
//                         round,
//                         time: dayData.t,
//                         order,
//                         currentPrice: dayData.c,
//                         sharesValueInUSD : 0,
//                         holdingUSD,
//                         initInvestment,
//                         sellingShare
//                     };
//                 }else{
//                     recordData = {
//                         round,
//                         time: dayData.t,
//                         order,
//                         currentPrice: dayData.c,
//                         sharesValueInUSD : holdingShare * dayData.c,
//                         holdingUSD,
//                         initInvestment,
//                         usingUSD,
//                         holdingShare
//                     };
//                 }


    
//                 record.push(recordData)
//                 if(order == "Sell") round += 1
//             }



            
//             return record
//         }else{
//             console.log("historical data not found")
//             return null
//         }

//     }catch(err){
//         console.log(err)
//         return null
//     }
// }

// const ProcessAndGroup = (dayData, group, order) =>{
//     try{
//         let result = true
//         for(let rule of group.rules){
//             let ex1 = rule.expression1.type
//             let ex2 = rule.expression2.type
//             let operator = rule.operator

//             if(ex1 == "MACD" || ex2 == "MACD"){
//                 //first day
//                 if(dayData.prevMACDHis == null || dayData.prevMACDLine == null || dayData.prevSignal == null){
//                     return false
//                 }else{
//                     //buy signal
//                     if (order == "Buy"){
//                         //red turn green
//                         if((dayData.prevMACDHis < 0 && dayData.MACDHistogram > 0)){
//                             //pass
//                             continue
//                         }else{
//                             return false
//                         }
//                     //sell
//                     }else if (order == "Sell"){
//                         //green turn red
//                         if((dayData.prevMACDHis > 0 && dayData.MACDHistogram < 0)){
//                             //pass
//                             continue
//                         }else{
//                             return false
//                         }
//                     }else{
//                         console.log("MACD error")
//                         return false
//                     }
//                 }
//             }else{
//                 //other rules
//                 let ex1Value = mapExpression(dayData,rule.expression1)
//                 let ex2Value = mapExpression(dayData,rule.expression2)
//                 let pass = checkCondition(operator,ex1Value,ex2Value)
//                 if(!pass){
//                     return false
//                 }
//             }
//         }

//         return result
//     }catch(err){
//         console.log(err)
//         return false
//     }
// }

// const ProcessNotGroup = (dayData, group)=>{
//     try{
//         let result = true
//         for (let rule of group.rules){
//             let ex1 = rule.expression1.type
//             let ex2 = rule.expression2.type
//             let operator = rule.operator

//             if(ex1 == "MACD" || ex2 == "MACD"){
//                 continue
//             }else{
//                 //other rules
//                 let ex1Value = mapExpression(dayData,rule.expression1)
//                 let ex2Value = mapExpression(dayData,rule.expression2)
//                 let pass = checkCondition(operator,ex1Value,ex2Value)

//                 // console.log(ex1Value + " " + ex2Value)
//                 if(pass){
//                     return false
//                 }
//             }
//         }

//         return result
//     }catch(err){
//         console.log(err)
//         return false
//     }
// }

// const ProcessCountGroup = (dayData, group, order) =>{
//     try{
//         let count = 0
//         let limit = group.value
//         for(let rule of group.rules){
//             let ex1 = rule.expression1.type
//             let ex2 = rule.expression2.type
//             let operator = rule.operator

//             if(ex1 == "MACD" || ex2 == "MACD"){
//                 //first day
//                 if(dayData.prevMACDHis == null || dayData.prevMACDLine == null || dayData.prevSignal == null){
//                     continue
//                 }else{
//                     //buy signal
//                     if (order == "Buy"){
//                         if((dayData.prevMACDHis < 0 && dayData.MACDHistogram > 0)){
//                             //pass
//                             count += 1
//                         }
//                     //sell
//                     }else if (order == "Sell"){
//                         if((dayData.prevMACDHis > 0 && dayData.MACDHistogram < 0)){
//                             //pass
//                             count += 1
//                         }
//                     }else{
//                         console.log("MACD error")
//                         continue
//                     }
//                 }
//             }else{
//                 //other rules
//                 let ex1Value = mapExpression(dayData,rule.expression1)
//                 let ex2Value = mapExpression(dayData,rule.expression2)
//                 let pass = checkCondition(operator,ex1Value,ex2Value)
//                 if(!pass){
//                     continue
//                 }else{
//                     count += 1
//                 }
//             }

//             // console.log(count + " " + limit)
//             if (count >= limit){
//                 return true
//             }
//         }

//         return false
//     }catch(err){
//         console.log(err)
//         return false
//     }
// }

// const checkCondition = (operator, expression1, expression2) => {
//     try{
//         switch (operator) {
//         case "<":
//             return expression1 < expression2;
//         case "<=":
//             return expression1 <= expression2;
//         case ">":
//             return expression1 > expression2;
//         case ">=":
//             return expression1 >= expression2;
//         case "=":
//             return expression1 === expression2;
//         default:
//             return false;
//         }
//     }catch(err){
//         console.log(err)
//         return false
//     }

// }

// const mapExpression = (dayData, expression) => {
//     switch(expression.type) {
//       case "Close Price":
//         return dayData.c;
//       case "Prev Close Price":
//         return dayData.pc;
//       case "Open Price":
//         return dayData.o;
//       case "Prev Open Price":
//         return dayData.po;
//       case "High Price":
//         return dayData.h;
//       case "Prev High Price":
//         return dayData.ph;
//       case "Low Price":
//         return dayData.l;
//       case "Prev Low Price":
//         return dayData.pl;
//       case "Volume":
//         return dayData.v;
//       case "Prev Volume":
//         return dayData.pv;
//       case "Number":
//         return expression.param.value;
//       case "SMA":
//         return dayData["sma"+expression.param.timePeriod]
//       case "EMA":
//         return dayData["EMA"+expression.param.timePeriod]
//       case "ADX":
//         return dayData.ADX;
//       case "RSI":
//         return dayData["RSI" + expression.param.timePeriod] 
//       case "SO":
//         return dayData["SO"+expression.param.timePeriod]
//       default:
//         throw new Error(`Unknown expression value: ${expression.value}`);
//     }
// }

// const Prev = (data) =>{
//     try{
//         for (let i in data){
//             if (i == 0){
//                 data[i].po = null
//                 data[i].ph = null
//                 data[i].pl = null
//                 data[i].pc = null
//                 data[i].pv = null
//             }else{
//                 data[i].po = data[i-1].o
//                 data[i].ph = data[i-1].h
//                 data[i].pl = data[i-1].l
//                 data[i].pc = data[i-1].c
//                 data[i].pv = data[i-1].v
//             }
//         }

//         return data
//     }catch(err){
//         console(err)
//         return data
//     }
// }

// const PrevMACD = (data) =>{
//     try{
//         for(let i in data){
//             if (i == 0){
//                 data[i].prevMACDHis = null
//                 data[i].prevMACDLine = null
//                 data[i].prevSignal = null
//             }else{
//                 data[i].prevMACDHis = data[i-1].MACDHistogram
//                 data[i].prevMACDLine = data[i-1].MACDLine
//                 data[i].prevSignal = data[i-1].signalLine
//             }
//         }
//         return data
//     }catch(err){
//         console.log(err)
//         return data
//     }
// }

// const ProcessHisData = (rules) =>{
//     try{
//         let pair = rules.pair
//         let type = rules.type

//         var filename = ""
//         if (type == 1){
//             filename =  (pair).slice(2)
//         }else if(type == 2){
//             filename = pair
//         }

//         var path = `HisData/${filename}.json`

//         if (fs.existsSync(path)){
//             let readData = fs.readFileSync(path)
//             let oldJsonData = JSON.parse(readData)
//             return oldJsonData.results
//         }else{
//             return []
//         }

//     }catch(err){
//         console.log(err)
//         return []
//     }
// }

// const GetPeriod = (rules, value) =>{
//     try{
//         let buyCondition = rules.buyCondition
//         let sellCondition = rules.sellCondition

//         let periodNumber = []
//         for(let group of buyCondition){
//             for(let rule of group.rules){
//                 if(rule.expression1.type == value){
//                     periodNumber.push(Number(rule.expression1.param.timePeriod))
//                 }else if(rule.expression2.type == value){
//                     periodNumber.push(Number(rule.expression2.param.timePeriod))
//                 }
//             }
//         }

//         for(let group of sellCondition){
//             for(let rule of group.rules){
//                 if(rule.expression1.type == value){
//                     periodNumber.push(Number(rule.expression1.param.timePeriod))
//                 }else if(rule.expression2.type == value){
//                     periodNumber.push(Number(rule.expression2.param.timePeriod))
//                 }
//             }
//         }
//         return [...new Set(periodNumber)]
//     }catch(err){
//         console.log(err)
//         return []
//     }
// }

// const SMA = (data, periods) =>{
//     try{
//         let closingPrices = data.map(obj => obj.c);
//         let smaValues = new Array(closingPrices.length);
      
//         for (let i = 0; i < closingPrices.length; i++) {
//           if (i < periods - 1) {
//             smaValues[i] = null;
//           } else {
//             let sum = 0;
//             for (let j = i; j > i - periods; j--) {
//               sum += closingPrices[j];
//             }
//             smaValues[i] = sum / periods;
//           }
//         }
      
//         let result = [];
      
//         let keyStr = "sma"+periods
//         for (let i = 0; i < data.length; i++) {
//           let obj = { ...data[i]};
//           obj[keyStr] = smaValues[i] 
//           result.push(obj);
//         }
      
//         return result;

//     }catch(err){
//         console.log(err)
//         return data
//     }
// }

// const MACD = (historicalData) =>{
//     try{
//         const fastPeriod = 12; // Fast period for EMA calculation
//         const slowPeriod = 26; // Slow period for EMA calculation
//         const signalPeriod = 9; // Signal period for EMA calculation
      
//         // Calculate the EMA (Exponential Moving Average) for the fast and slow periods
//         let fastEMA = calculateEMA(historicalData, fastPeriod);
//         let slowEMA = calculateEMA(historicalData, slowPeriod);
      
//         // Calculate the MACD Line
//         let MACDLine = fastEMA.map((value, index) => {
//           return value - slowEMA[index];
//         });

//         // Calculate the Signal Line (EMA of the MACD Line)
//         let signalLine = calculateEMA(MACDLine, signalPeriod);
      
//         // Calculate the MACD Histogram
//         let MACDHistogram = MACDLine.map((value, index) => {
//           return value - signalLine[index];
//         });
      
//         // Store the calculated MACD values into the historicalData object
//         historicalData.forEach((data, index) => {
//           data.MACDLine = MACDLine[index];
//           data.signalLine = signalLine[index];
//           data.MACDHistogram = MACDHistogram[index];
//         });
      
//         return historicalData;
//     }catch(err){
//         console.log(err)
//         return historicalData
//     }
// }

// const calculateEMA = (data, period) =>{
//     try{
//         let EMAArray = [];
//         let multiplier = 2 / (period + 1);
//         let EMA = data[0].c == undefined ? data[0] : data[0].c;
      
//         for (let i = 0; i < data.length; i++) {
//             let tempData = data[i].c == undefined ? data[i] : data[i].c
//           EMA = (tempData - EMA) * multiplier + EMA;
//           data[i]["EMA"+period] = EMA
//           EMAArray.push(EMA);
//         }
//         return EMAArray;
//     }catch(err){
//         console.log(err)
//     }
//   }

// const RSI = (data, period) =>{
//     //RS = prevAvgGain / prevAvgLoss
//     //RSI = 100 - (100 / (1 + RS))

//     try{
//         for (let i = period; i < data.length; i++) {
//             let gains = 0;
//             let losses = 0;
//             for (let j = i - period; j < i; j++) {
//               let change = data[j + 1].c - data[j].c;
//               if (change >= 0) {
//                 gains += change;
//               } else {
//                 losses += Math.abs(change);
//               }
//             }
//             let avgGain = gains / period;
//             let avgLoss = losses / period;
//             let RS = avgGain / avgLoss;
//             let RSI = 100 - (100 / (1 + RS));
//             data[i]["RSI"+period] = RSI;
//           }
//           return data;
//         // let prevAvgGain = 0;
//         // let prevAvgLoss = 0;
        
//         // for (let i = 0; i < historicalData.length; i++) {
//         //   const data = historicalData[i];
//         //   const close = data.c;
//         //   let gain = 0;
//         //   let loss = 0;
      
//         //   if (i > 0) {
//         //     const prevData = historicalData[i-1];
//         //     const prevClose = prevData.c;
//         //     const diff = close - prevClose;
      
//         //     if (diff > 0) {
//         //       gain = diff;
//         //     } else {
//         //       loss = Math.abs(diff);
//         //     }
      
//         //     prevAvgGain = ((prevAvgGain * (period - 1)) + gain) / period;
//         //     prevAvgLoss = ((prevAvgLoss * (period - 1)) + loss) / period;
//         //   }
      
//         //   if (i >= period) {
//         //     const RS = prevAvgGain / prevAvgLoss;
//         //     const RSI = 100 - (100 / (1 + RS));
//         //     data["RSI"+period] = Number(RSI.toFixed(2));
//         //   }else{
//         //     data["RSI"+period] = null
//         //   }
//         // }
      
//         // return historicalData;
//     }catch(err){
//         console.log(err)
//         return historicalData
//     }
// }

// const ADX = (data)=>{
//     try{
//         // https://www.investopedia.com/terms/a/adx.asp
//         const period = 14; // ADX period
//         const dmPlusArr = [];
//         const dmMinusArr = [];
//         const trArr = [];
//         const trueRange = (i) => Math.max(
//           data[i].h - data[i].l,
//           Math.abs(data[i].h - data[i - 1].c),
//           Math.abs(data[i].l - data[i - 1].c)
//         );
//         const positiveDirectionalMovement = (i) =>
//           data[i].h - data[i - 1].h > data[i - 1].l - data[i].l
//             ? Math.max(data[i].h - data[i - 1].h, 0)
//             : 0;
//         const negativeDirectionalMovement = (i) =>
//           data[i - 1].l - data[i].l > data[i].h - data[i - 1].h
//             ? Math.max(data[i - 1].l - data[i].l, 0)
//             : 0;
      
//         for (let i = 1; i < data.length; i++) {
//           dmPlusArr.push(positiveDirectionalMovement(i));
//           dmMinusArr.push(negativeDirectionalMovement(i));
//           trArr.push(trueRange(i));
//         }
      
//         const smoothDMPlus = (i) => {
//           if (i === period) {
//             return dmPlusArr.slice(0, period).reduce((acc, val) => acc + val) / period;
//           } else {
//             return (smoothDMPlus(i - 1) * (period - 1) + dmPlusArr[i - 1]) / period;
//           }
//         };
      
//         const smoothDMMinus = (i) => {
//           if (i === period) {
//             return dmMinusArr.slice(0, period).reduce((acc, val) => acc + val) / period;
//           } else {
//             return (smoothDMMinus(i - 1) * (period - 1) + dmMinusArr[i - 1]) / period;
//           }
//         };
      
//         const smoothTR = (i) => {
//           if (i === period) {
//             return trArr.slice(0, period).reduce((acc, val) => acc + val) / period;
//           } else {
//             return (smoothTR(i - 1) * (period - 1) + trArr[i - 1]) / period;
//           }
//         };
      
//         const plusDI = (i) => (smoothDMPlus(i) / smoothTR(i)) * 100;
//         const minusDI = (i) => (smoothDMMinus(i) / smoothTR(i)) * 100;
//         const diDiff = (i) => Math.abs(plusDI(i) - minusDI(i));
//         const diSum = (i) => plusDI(i) + minusDI(i);
//         const diDiffSum = (i) => diDiff(i) + diSum(i);
      
//         const dx = (i) => (diDiffSum(i) !== 0 ? (diDiff(i) / diDiffSum(i)) * 100 : 0);
      
//         const firstADX = dx(period);
//         const adxArr = [firstADX];
      
//         for (let i = period + 1; i < data.length; i++) {
//           adxArr.push((adxArr[i - period - 1] * (period - 1) + dx(i - 1)) / period);
//         }
      
//         for (let i = period * 2; i < data.length; i++) {
//             data[i].ADX = adxArr[i - period * 2];
//         }

//         for (let i = 0; i < period * 2; i++) {
//             data[i].ADX = null;
//         }
      
//         return data;
//     }catch(err){
//         console.log(err)
//     }
// }

// const SO = (data, period) =>{
//     // Stochastic Oscillator
//     // K% = ((C-L_period)/(H_period-L_period)) * 100
//     try{
//         for (let i = 0; i < data.length; i++) {
//             if(i >= (period - 1)){
//                 const periodData = data.slice(i - period + 1, i + 1);
//                 const highestHigh = Math.max(...periodData.map((d) => d.h));
//                 const lowestLow = Math.min(...periodData.map((d) => d.l));
//                 const currentClose = data[i].c;
//                 const SO = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
//                 data[i]["SO"+period] = SO; 
//             }else{
//                 data[i]["SO"+period] = null; 
//             }
//           }
//           return data

//     }catch(err){
//         console.log(err)
//         return historicalData
//     }
// }

module.exports = router
