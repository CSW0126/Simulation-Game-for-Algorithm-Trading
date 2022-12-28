import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import APICall from '../apiCall/API'
import AnimateChart from './Charts/AnimateChart'
import moment from 'moment'
import ExecutionTable from './ExecutionTable'
import ProfitMovementChart from './Charts/ProfitMovementChart'
import { Spinner } from "baseui/spinner";
import { Button } from 'baseui/button'
import Collapse from '@mui/material/Collapse';
import MarFinal from './Form/Steps/MarFinal'

const Record = () => {
    const params = useParams()
    const [record_id, setRecord_id] = useState(params.id)
    const [isError, setIsError] = useState(true)
    const [errorMsg, setErrorMsg] = useState("Loading...")
    const [rulesData, setRulesData] = useState(null)
    const [simulationData, setSimulationData] = useState([])
    const [rawSimulationData, setRawSimulationData] = useState([])
    const [historicalData, setHistoricalData] = useState([])
    const [movementData, setMovementData] = useState([])
    const [rawMovementData, setRawMovementData] = useState([])
    const [speed, setSpeed] = useState(0.1)
    const [open, setOpen] = useState(false);
    const [displayPrice, setDisplayPrice] = useState({
      open:0,
      high:0,
      low:0,
      close:0,
      volume:0
    })

    const handleCollapseClick = () => {
      setOpen(!open);
    };

    useEffect(()=>{
      setErrorMsg("Loading...")
    },[])

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
          setErrorMsg("Error...")
          setIsError(true)
        }
      }
      fetchResult()

    },[record_id])

    const ruleDetails = () =>{
      switch(rulesData?.algoType){
        case 1:
          return (
              <MarFinal userData={rulesData}/>
          )

        case 2:
          return <div>2</div>
        case 3:
          return <div>3</div>
        default:
          return <div>4</div>
      }
    }

  const ErrorBody = (
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
          <p className=' font-semibold text-cyan-600 m-5 text-xl' >{errorMsg}.</p>
          <div className='ml-5 mb-5'>
            {errorMsg != "Error..." ? (<Spinner $color="#0891b2" />):(<></>)}
          </div>
      </div>
  )
  const SuccessBody = (

      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5 mt-5'>
        <p className=' font-semibold text-cyan-600 m-5 text-xl' >Record Summary</p>
        <div className='ml-5 mb-5'>
          <Button onClick={()=>handleCollapseClick()}>Rules Review</Button>
        </div>
        <div className=''>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {ruleDetails()}
          </Collapse>
        </div>

        <div className='m-5 '>
          <AnimateChart data={historicalData.data} speed={speed} simulationData={simulationData} displayPrice={displayPrice} setDisplayPrice={setDisplayPrice}/>
        </div>
        <p className=' font-semibold text-cyan-600 mx-5 text-sm mt-5' >Profit Movement</p>
        <div className='m-5'>
          <ProfitMovementChart data={movementData} ruleData={rulesData} rawData={rawMovementData.objArr}/>
        </div>

        <p className=' font-semibold text-cyan-600 mx-5 text-sm' >Buy / Sell Record</p>
        <div className='grid grid-cols-1'>
          <ExecutionTable data={rawSimulationData} rules={rulesData}/>
        </div>
      </div>
      

  )
  return (
    <div className='mb-10 ' >
      {isError? ErrorBody: SuccessBody}
    </div>

  )
}

export default Record