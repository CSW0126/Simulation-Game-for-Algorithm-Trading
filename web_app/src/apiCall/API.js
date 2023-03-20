import axios from 'axios';
import moment from 'moment'

export const APICall = {
    AsyncGetHistoricalData : async(object) =>{
        try{
            // let apiObject = {
            //     type:userData.type,
            //     ticker:userData.pair,
            //     from: twoYearsAgo,
            //     to: today,
            //     token: Cookies.get('_auth')
            //   }
            if(object.type === 1 || object.type === 2){
                let url = `${process.env.REACT_APP_SERVER_HOST}/his/getHistoricalData`
                let body = object

                const response = await axios.post(
                    url,
                    body
                );
                return response.data
            }
            

        }catch(err){
            return {status: 'fail', error: err}
        }
    },
    ReturnDataProcessor : (data) =>{
        try{
            console.log(data)
            let processData = {
                name : data.ticker,
                data : data.results
            }

            console.log(processData.data)

            for (let i in processData.data){
                let old = processData.data[i]
                
                let newData  = {
                    time: moment(old.t).format('YYYY-MM-DD'),
                    open:  old.o,
                    high: old.h,
                    low: old.l,
                    close: old.c,
                    value : old.v
                }
                //The colors in the Volume chart also have meaning. 
                //A green volume bar means that the stock closed higher on that day verses the previous day’s close. 
                //A red volume bar means that the stock closed lower on that day compared to the previous day’s close.
                if (i == 0){
                    newData['color'] = 'rgba(0, 150, 136, 0.8)'
                }else{
                    // console.log(processData.data[i-1].close)
                    if (newData.close > processData.data[i-1].close){
                        //green
                        newData.color = 'rgba(0, 150, 136, 0.8)'
                    }else{
                        //red
                        newData.color = 'rgba(255,82,82, 0.8)'
                    }
                }

                processData.data[i] = newData
            }

            return processData

        }catch(err){
            console.log(err)
            return null
        }
    },
    AsyncGetSimulation : async(object) =>{
        try{
            let url = `${process.env.REACT_APP_SERVER_HOST}/simulation`
            const response = await axios.post(
                url,
                object
            );
            return response.data
        }catch(err){
            return {status: 'fail', error: err}
        }
    },
    AsyncFetchUser: async(token) =>{
        try{
            let url = `${process.env.REACT_APP_SERVER_HOST}/user/view`
            let body = {token:token}
            const response = await axios.post(
                url,
                body
            );
            return response.data
        }catch(e){
            console.log(e)
            return {status: 'fail', error: e}
        }
    },
    AsyncFetchRanking: async(token) =>{
        try{
            let url = `${process.env.REACT_APP_SERVER_HOST}/simulation/getRank`
            let body = {token:token}
            const response = await axios.post(
                url,
                body
            );
            return response.data
        }catch(e){
            console.log(e)
            return {status: 'fail', error: e}
        }
    },
    AsyncFetchRecord : async(obj) =>{
        try{
            let url = `${process.env.REACT_APP_SERVER_HOST}/user/viewRecord`
            let body = obj

            const response = await axios.post(
                url,
                body
            )
            return response.data
        }catch(err){
            console.log(err)
            return {status:'fail',error:err}
        }
    },
    SimulationDataToMarkers : (simData)=>{
        try{
            console.log(simData)
            let markers = []
            for(let i in simData){
                let time = simData[i].time
                let found = markers.find(ele => ele.time == time)
                if(found) continue
                let obj = {
                    time: simData[i].time,
                    position: simData[i].order == "Buy" ? "aboveBar": "belowBar",
                    shape: simData[i].order == "Buy" ? "arrowDown":"arrowUp",
                    color: simData[i].order == "Buy" ? "#4CAF50":"#FF5252",
                    text: simData[i].order+ " @ " + simData[i].executePrice
                }

                markers.push(obj)
            }
            return markers
        }catch(e){
            console.log(e)
            return null
        }
    },
    SimulationDataToMarkersDCA: (simData)=>{
        try{
            let markers = []
            for(let i in simData){
                if (i == simData.length-1) break
                if(simData[i].order == "None") continue
                let obj = {
                    time: moment(simData[i].time).format("YYYY-MM-DD"),
                    position: simData[i].order == "Buy" ? "aboveBar": "belowBar",
                    shape: simData[i].order == "Buy" ? "arrowDown":"arrowUp",
                    color: simData[i].order == "Buy" ? "#4CAF50":"#FF5252",
                    text: simData[i].order+ " @ " + simData[i].currentPrice
                }

                markers.push(obj)
            }
            return markers
        }catch(e){
            console.log(e)
            return null
        }
    },
    SimulationDataToMarkersInc : (simData) =>{
        try{
            let markers = []
            for(let i in simData){
                if (i == simData.length-1) break
                if(simData[i].order == "None") continue
                let obj = {
                    time: moment(simData[i].time).format("YYYY-MM-DD"),
                    position: simData[i].order == "Buy" ? "aboveBar": "belowBar",
                    shape: simData[i].order == "Buy" ? "arrowDown":"arrowUp",
                    color: simData[i].order == "Buy" ? "#4CAF50":"#FF5252",
                    text: simData[i].order+ " @ " + simData[i].currentPrice
                }
                markers.push(obj)
            }
            return markers
        }catch(e){
            console.log(e)
            return null
        }
    },
    GetProfitMovementDataForDCA: (simulationData, historicalData, data) =>{
        try{
            let simData = simulationData.message
            let objArr = []
            let profitArray = []

            for (let i in simData){
                let dataObj = {}
                dataObj.time = simData[i].time
                dataObj.price = simData[i].currentPrice
                dataObj.holdingShares = simData[i].holdingShare
                dataObj.usingUSD = simData[i].usingUSD
                dataObj.round = simData[i].round
                dataObj.holdingValue = simData[i].sharesValueInUSD
                profitArray.push(simData[i].sharesValueInUSD)
                objArr.push(dataObj)
            }

            // console.log("jo")
            // console.log(result)
            let result = {
                objArr,
                data : profitArray
            }
            return result
        }catch(err){
            console.log(err)
            return {data:[]}
        }

    },
    GetProfitMovementData : (simulationData, historicalData, data) =>{
        try{
            console.log(simulationData.message)
            let startDate = moment(data.rangeDate[0]).valueOf()
            let endDate = moment(data.rangeDate[1]).valueOf()
            let orderData = simulationData.message.reverse()
            let profitArray = []
            let processedHistoricalData = []
            let objArr = []
    
            for(let i in historicalData){
                if(historicalData[i].t < startDate) continue
                if(historicalData[i].t > endDate) continue
                processedHistoricalData.push(historicalData[i])
            }
    
            let lastHoldingUSD = data.investment
            let lastHoldingShares = 0
            let lastOrder = 0
    
            for(let i in processedHistoricalData){
                let dataObj = {}
                let date = moment(processedHistoricalData[i].t).format("YYYY-MM-DD")
                let price = processedHistoricalData[i].c
                
                dataObj.time = date
                dataObj.price = price

                const data2Item = orderData.find(j =>j.time <= date)
                if(data2Item){
                    lastHoldingShares = data2Item.holdingShares
                    lastHoldingUSD = data2Item.holdingUSD
                    lastOrder = data2Item.round

                    dataObj.holdingShares = lastHoldingShares
                    dataObj.holdingUSD = lastHoldingUSD
                    dataObj.round = lastOrder
                }else{
                    console.log("NAN")
                }
                const value = lastHoldingShares * price + lastHoldingUSD

                dataObj.holdingValue = value
                profitArray.push(value)
                objArr.push(dataObj)
            }
            let result = {
                objArr,
                data : profitArray
            }

            return result
        }catch(e){
            console.log(e)
            return {data:[]}
        }
    },
    GetIncProfitMovementData : (data) =>{
        try{
            const temp = {...data.message}
            let record = []
            for (let i in temp){
                let obj = {
                    time: moment(temp[i].time).format("YYYY-MM-DD"),
                    value: (temp[i].sharesValueInUSD + temp[i].holdingUSD)
                }

                record.push(obj)
            }
            return record
        }catch(err){
            console.log(err)
            return []
        }
    },
    GetProfitMovementDataForInd:(simulationData, historicalData, data) =>{
        try{
            let simData = simulationData.message
            let objArr = []
            let profitArray = []

            console.log("inc")
            console.log(simData)

            for (let i in simData){
                let dataObj = {}
                dataObj.time = simData[i].time
                dataObj.price = simData[i].currentPrice
                dataObj.holdingShares = simData[i].holdingShare
                dataObj.usingUSD = simData[i].usingUSD
                dataObj.round = simData[i].round
                dataObj.holdingValue = simData[i].sharesValueInUSD
                profitArray.push((simData[i].sharesValueInUSD + simData[i].holdingUSD))
                objArr.push(dataObj)
            }

            // console.log("jo")
            // console.log(result)
            let result = {
                objArr,
                data : profitArray
            }
            return result
        }catch(err){
            console.log(err)
            return []
        }
    },
    MatchProfitWithData : (profitMoveData, processHis) =>{
        try{
            if(processHis.length == profitMoveData.length){
                let result = []
                // console.log(profitMoveData)
                for(let i in processHis){
                    let obj = {
                        time: processHis[i].time,
                        value: profitMoveData[i]
                    }
                    result.push(obj)
                }
                return result
            }else{
                throw "Length Not Same"
            }
        }catch(e){
            console.log(e)
            return []
        }
    },
    HandleToFixed : (value, pair) =>{
        try{
            if(pair == "X:BTCUSD"){
                return value.toFixed(0)
            }else if(pair == "X:DOGEUSD"){
                return value.toFixed(5)
            }else if(pair == "X:MATICUSD"){
                return value.toFixed(4)
            }else if(pair == "X:ETHUSD"){
                return value.toFixed(0)
            }else{
                return value.toFixed(2)
            }

        }catch(e){
            console.log(e)
            return value
        }
    },
    HandleGetCoinToFixed : (value, pair) =>{
        try{
            if(pair == "X:BTCUSD"){
                return value.toFixed(6) + " BTC"
            }else if(pair == "X:DOGEUSD"){
                return value.toFixed(2) + " DOGE"
            }else if(pair == "X:MATICUSD"){
                return value.toFixed(2) + " MATIC"
            }else if(pair == "X:ETHUSD"){
                return value.toFixed(5) + " ETH"
            }else{
                return value.toFixed(0)
            }

        }catch(e){
            return value
        }
    },
    ConvertToHoldingSharesValue : (data) =>{
        try{
            let preData = data.message
            let result = []
            for(let i in preData){
                let obj = {
                    time: moment(preData[i].time).format("YYYY-MM-DD"),
                    value: preData[i].sharesValueInUSD
                }
                result.push(obj)
            }

            return result
        }catch(err){
            console.log(err)
            return []
        }
    },

    ConvertToUsingUSD : (data) =>{
        try{
            let preData = data.message
            let result = []
            for(let i in preData){
                let obj = {
                    time: moment(preData[i].time).format("YYYY-MM-DD"),
                    value: preData[i].usingUSD
                }
                result.push(obj)
            }

            return result
        }catch(err){
            console.log(err)
            return []
        }
    },
    GetCurrentPriceDCA : (dayStr, data) =>{
        try{
            // console.log(dayStr)
            // console.log(data)
            for(let i in data.message){
                let tempStr = moment(data.message[i].time).format("YYYY-MM-DD")
                if(tempStr == dayStr){
                    return data.message[i].currentPrice
                }
            }
        }catch(err){
            console.log(err)
            return ''  
        }
    },

    GetHoldingShares : (dayStr, data) =>{
        try{
            for(let i in data.message){
                let tempStr = moment(data.message[i].time).format("YYYY-MM-DD")
                if(tempStr == dayStr){
                    return data.message[i].holdingShare
                }
            }
        }catch(err){
            console.log(err)
            return ''
        }
    },
    GetDCAInvestment : (data) =>{
        try{
            let result = 0
            for(let i in data){
                if(data[i].order == "Buy"){
                    
                }
            }
        }catch(err){
            console.log(err)
            return 0
        }
    }
}

export default APICall