import axios, { AxiosError } from 'axios';

export const APICall = {
    AsyncGetHistoricalData : async(object) =>{
        try{
            if(object.type == 1){
                // let url = `https://api.polygon.io/v2/aggs/ticker/${object.pair}/range/1/day/${object.from}/${object.to}?adjusted=true&sort=asc&limit=50000&apiKey=${process.env.REACT_APP_POLYGON_KEY}`
                let url = `${process.env.REACT_APP_SERVER_HOST}/his/getCryptoData`
                console.log(object)
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
    }
}

export default APICall