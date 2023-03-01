import React, {useRef, useEffect,useState, useMemo} from 'react'
import { Sparklines, SparklinesLine, SparklinesReferenceLine  } from 'react-sparklines';
import Cookies from 'js-cookie'
import APICall from '../../../apiCall/API';
import moment from 'moment'

const arrayMin = (data)=> Math.min.apply(Math, data)
const arrayMax = (data)=> Math.max.apply(Math, data)

const calcRefValue = ({ data, height, margin, referenceValue }) => {
    if (referenceValue === undefined) return
    const max = arrayMax(data)
    const min = arrayMin(data)
    const vfactor = (height - margin * 2) / (max - min || 2)
    const returnValue = (max === min ? 1 : max - referenceValue) * vfactor + margin
    return returnValue
}

const ProfitMove = (props) => {
    const [fetchData, setFetchData] = useState([])
    const height = 50
    const margin = 0
    const {data} = props

    const refValue = useMemo(() => {
        if(data.algoType == 1){
            return calcRefValue({ data: fetchData, height, margin, referenceValue: data.investment })
        }else if(data.algoType == 2){
            return  calcRefValue({ data: fetchData, height, margin, referenceValue: (data.DCAInvestAmount * data.validDate) })
        }

    }, [fetchData, height, margin])

    useEffect(()=>{
        const fetchData = async()=>{
            let today = moment().format("YYYY-MM-DD")
            let twoYearsAgo = moment().add(-730, 'days').format("YYYY-MM-DD")
            let token = Cookies.get("_auth")

            let body = {
                data,
                token
            }

            let historicalObj = {
                type:data.type,
                ticker: data.pair,
                from: twoYearsAgo,
                to:today,
                token
            }
            let response = await APICall.AsyncGetSimulation(body) 
            let historicalDataResponse = await APICall.AsyncGetHistoricalData(historicalObj)
            processFetchData(response, historicalDataResponse.message.results)
        }

        fetchData()
    },[data])
   
    const processFetchData = (response, historicalData) =>{
        // console.log(historicalData)
        // console.log(response.message)
        // console.log(data)
        if(data.algoType == 1){
            let profitArray = APICall.GetProfitMovementData(response, historicalData, data).data
            setFetchData(profitArray)
        }else if(data.algoType == 2){

            let profitArray = APICall.GetProfitMovementDataForDCA(response, historicalData, data).data
            setFetchData(profitArray)
        }
    }

    const calColor = () =>{
        let result = "#E91E63"
        if(data.algoType == 1){
            if (data.investment > fetchData[fetchData.length-1]){
                result =  "#E91E63"
            }else{
                result = "#089981"
            }
        }else if(data.algoType == 2){
            if (data.DCAInvestAmount * data.validDate > fetchData[fetchData.length-1]){
                result = "#E91E63"
            }else{
                result = "#089981"
            }
        }

        return result
    }
  return (
    <Sparklines 
        data={fetchData}
        width={150} height={height} margin={0}
        style={{}}
        >
        <SparklinesLine color={calColor()}  />
        <Sparklines 
            data={fetchData}
            width={150} height={height} margin={0}
            style={{}}
        ></Sparklines>
        <SparklinesReferenceLine type="custom" value={refValue} 
            style={
                {stroke:"#E91E63", strokeDasharray: '2, 2'}
            }
            />
    </Sparklines>
  )
}

export default ProfitMove