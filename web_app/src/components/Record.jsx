import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import APICall from '../apiCall/API'
import AnimateChart from './Charts/AnimateChart'
import moment from 'moment'
import ExecutionTable from './ExecutionTable'
import ProfitMovementChart from './Charts/ProfitMovementChart'
import { Spinner } from "baseui/spinner";

const Record = () => {
    const params = useParams()
    const [record_id, setRecord_id] = useState(params.id)
    const [isError, setIsError] = useState(true)
    const [rulesData, setRulesData] = useState(null)
    const [simulationData, setSimulationData] = useState([])
    const [rawSimulationData, setRawSimulationData] = useState([])
    const [historicalData, setHistoricalData] = useState([])
    const [movementData, setMovementData] = useState([])
    const [rawMovementData, setRawMovementData] = useState([])
    const [speed, setSpeed] = useState(0.1)
    const [displayPrice, setDisplayPrice] = useState({
      open:0,
      high:0,
      low:0,
      close:0,
      volume:0
    })
    useEffect(()=>{
      const fetchResult = async()=>{
        try{
          let token = Cookies.get("_auth")
          let getRuleRequest = {
            token,
            record_id
          }
          //fetch record
          let responseOfRecord = await APICall.AsyncFetchRecord(getRuleRequest)
          if(responseOfRecord.status == 'success'){
            setRulesData(responseOfRecord.message)
            
            let getSimulationBody = {
              data: responseOfRecord.message,
              token
            }
            //fetch simulation
            let responseOfSimulation = await APICall.AsyncGetSimulation(getSimulationBody)
            if(responseOfSimulation.status == 'success'){
              let simTemp = responseOfSimulation.message
              let simTempReverse = [...simTemp]
              setRawSimulationData(simTempReverse)
              let markers = APICall.SimulationDataToMarkers(simTemp)
              setSimulationData(markers)
            }else{
              throw "responseOfSimulation fail"
            }

            //fetch historical data
            let today = moment().format("YYYY-MM-DD")
            let twoYearsAgo = moment().add(-730, 'days').format("YYYY-MM-DD")
            let hisRequest = {
              type:responseOfRecord.message.type,
              ticker:responseOfRecord.message.pair,
              from: twoYearsAgo,
              to: today,
              token
            }
            let hisResponse = await APICall.AsyncGetHistoricalData(hisRequest)
            if(hisResponse.status == 'success'){
              let hisTemp = hisResponse.message.results
              let startDate = moment(responseOfRecord.message.rangeDate[0]).valueOf()
              let endDate = moment(responseOfRecord.message.rangeDate[1]).valueOf()
              hisTemp = hisTemp.filter(item => item.t <= endDate)
              hisTemp = hisTemp.filter(item => item.t >= startDate)

              let passObj = {
                ticker: responseOfRecord.message.pair,
                results: hisTemp
              }
              setHistoricalData(APICall.ReturnDataProcessor(passObj))
              setIsError(false)

              let rawProfitMoveData = APICall.GetProfitMovementData(responseOfSimulation, hisResponse.message.results, responseOfRecord.message)
              // console.log(rawProfitMoveData)
              setRawMovementData(rawProfitMoveData)
              let profitMoveData = APICall.MatchProfitWithData(rawProfitMoveData.data, hisTemp)
              // console.log(profitMoveData.length)
              // console.log(processHis.length)
              // console.log(profitMoveData)
              setMovementData(profitMoveData)
            }else{
              throw "fetch historical data fail"
            }

          }else{
            throw "responseOfRecord fail"
          }
        }catch(e){
          console.log(e)
          setIsError(true)
        }
      }
      fetchResult()

    },[record_id])


  const ErrorBody = (
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
          <p className=' font-semibold text-cyan-600 m-5 text-xl' >Loading...</p>
          <div className='ml-5 mb-5'>
            <Spinner $color="#0891b2" />
          </div>

      </div>
  )
  const SuccessBody = (

      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
        <p className=' font-semibold text-cyan-600 m-5 text-xl' >Record Summary</p>
        <div className='ml-5 p-5 grid grid-cols-1 gap-4 border-t-1 border-gray-300'>
        {/* <div className='flex'>
            <p className='gap-5 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 m-2 text-left text-sm'>High : 
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.high}</span> - Low:&nbsp;
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.low}</span> - Open:&nbsp;
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.open}</span> - Close:&nbsp;
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.close}</span> - Volume:&nbsp;
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.volume}</span>
            </p>
          </div> */}
          <AnimateChart data={historicalData.data} speed={speed} simulationData={simulationData} displayPrice={displayPrice} setDisplayPrice={setDisplayPrice}/>
        </div>
        <p className=' font-semibold text-cyan-600 mx-5 text-sm mt-5' >Profit Movement</p>
        <div className='px-5 pb-10 pt-5'>
          <ProfitMovementChart data={movementData} ruleData={rulesData} rawData={rawMovementData.objArr}/>
        </div>

        <p className=' font-semibold text-cyan-600 mx-5 text-sm' >Buy / Sell Record</p>
        <div>
          <ExecutionTable data={rawSimulationData} rules={rulesData}/>
        </div>
      </div>

  )
  return (
    <div className='mb-10 min-w-[70%]'>
      {isError? ErrorBody: SuccessBody}
    </div>
  )
}

export default Record