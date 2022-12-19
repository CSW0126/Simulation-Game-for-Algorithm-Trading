import axios from 'axios';
import moment from 'moment'

export const APICall = {
    AsyncGetHistoricalData : async(object) =>{
        try{
            if(object.type === 1){
                // let url = `https://api.polygon.io/v2/aggs/ticker/${object.pair}/range/1/day/${object.from}/${object.to}?adjusted=true&sort=asc&limit=50000&apiKey=${process.env.REACT_APP_POLYGON_KEY}`
                let url = `${process.env.REACT_APP_SERVER_HOST}/his/getCryptoData`
                let body = object
                // body.from = '2022-02-02'
                // body.to = '2022-12-12'
                // body.from = '2022-03-03'
                // body.to = '2022-12-18'
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
    }
}

export default APICall