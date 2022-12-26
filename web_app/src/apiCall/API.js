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
            if(object.type === 1){
                let url = `${process.env.REACT_APP_SERVER_HOST}/his/getCryptoData`
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
    GetProfitMovementData : (simulationData, historicalData, data) =>{
        try{
            let startDate = moment(data.rangeDate[0]).valueOf()
            let endDate = moment(data.rangeDate[1]).valueOf()
            let orderData = simulationData.message.reverse()
            let profitArray = []
            let processedHistoricalData = []
    
            for(let i in historicalData){
                if(historicalData[i].t < startDate) continue
                if(historicalData[i].t > endDate) continue
                processedHistoricalData.push(historicalData[i])
            }
    
            let lastHoldingUSD = data.investment
            let lastHoldingCoin = 0
    
            for(let i in processedHistoricalData){
                let date = moment(processedHistoricalData[i].t).format("YYYY-MM-DD")
                let price = processedHistoricalData[i].c
    
                const data2Item = orderData.find(j =>j.time <= date)
                if(data2Item){
                    lastHoldingCoin = data2Item.holdingCoin
                    lastHoldingUSD = data2Item.holdingUSD
                }
                const value = lastHoldingCoin * price + lastHoldingUSD
                profitArray.push(value)
     
            }
            return profitArray
        }catch(e){
            console.log(e)
            return []
        }
    },
    MatchProfitWithData : (profitMoveData, processHis) =>{
        try{
            if(processHis.length == profitMoveData.length){
                let result = []
                console.log(profitMoveData)
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
    }
}

export default APICall