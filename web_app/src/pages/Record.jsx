import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import APICall from '../apiCall/API'
import AnimateChart from '../components/Charts/AnimateChart/AnimateChart'
import moment from 'moment'
import ExecutionTable from '../components/Table/ExecutionTable'
import ExecutionTableForInc from '../components/Table/ExecutionTableForInc'
import ProfitMovementChart from '../components/Charts/ProfitMoveChart/ProfitMovementChart'
import { Spinner } from "baseui/spinner";
import { Button } from 'baseui/button'
import Collapse from '@mui/material/Collapse';
import MarFinal from '../components/Form/Steps/four/MarFinal'
import DCAFinal from '../components/Form/Steps/four/DCAFinal'
import {MdOutlineAttachMoney} from 'react-icons/md'
import {BsCurrencyExchange} from 'react-icons/bs'
import {BsCoin, BsArrow90DegDown} from 'react-icons/bs'
import {TbReportMoney} from 'react-icons/tb'
import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai'
import {CgShutterstock} from 'react-icons/cg'
import DCAMovementChart from '../components/Charts/ProfitMoveChart/DCAMovementChart'
import {Card, StyledBody} from 'baseui/card';
import ExecutionTableForDCA from '../components/Table/ExecutionTableForDCA'
import IndFinal from '../components/Form/Steps/four/IndFinal'

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
    const [incMovementData, setIncMovementData] = useState([])
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
              let markers = []
              if(responseOfRecord.message.algoType == 1){
                  markers = APICall.SimulationDataToMarkers(simTemp)
              }else if(responseOfRecord.message.algoType == 2){
                  markers = APICall.SimulationDataToMarkersDCA(simTemp)
              }else if(responseOfRecord.message.algoType == 3){
                  markers = APICall.SimulationDataToMarkersInc(simTemp)
              }

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
            // console.log("hisResponse")
            // console.log(hisResponse)
            if(hisResponse.status == 'success'){
              let hisTemp = hisResponse.message.results
              let startDate = moment(responseOfRecord.message.rangeDate[0]).valueOf()
              let endDate = moment(responseOfRecord.message.rangeDate[1]).valueOf()
              if(responseOfRecord.message.algoType == 1 || responseOfRecord.message.algoType == 2){
                hisTemp = hisTemp.filter(item => item.t <= endDate)
                hisTemp = hisTemp.filter(item => item.t >= startDate)
              }


              let passObj = {
                ticker: responseOfRecord.message.pair,
                results: hisTemp
              }
              setHistoricalData(APICall.ReturnDataProcessor(passObj))
              setIsError(false)
              let rawProfitMoveData = []
              if(responseOfRecord.message.algoType == 1){
                rawProfitMoveData = APICall.GetProfitMovementData(responseOfSimulation, hisResponse.message.results, responseOfRecord.message)
                setRawMovementData(rawProfitMoveData)
                let profitMoveData = APICall.MatchProfitWithData(rawProfitMoveData.data, hisTemp)
                setMovementData(profitMoveData)
              }else if(responseOfRecord.message.algoType == 2){
                // console.log("2")
                // console.log(responseOfSimulation)
                setMovementData(responseOfSimulation)
              }else if(responseOfRecord.message.algoType == 3){
                // console.log("3")
                // console.log(responseOfSimulation)
                let temp = APICall.GetIncProfitMovementData(responseOfSimulation)
                setRawMovementData(responseOfSimulation)
                setIncMovementData(temp)
                setMovementData(responseOfSimulation)
              }
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

    const GetMartMaxDrawdown = ()=>{
      try{
       let min = Math.min(...rawMovementData.objArr.map(item => item.holdingValue))
       let invested = rulesData.investment
       let max = (-(1-min/invested)*100).toFixed(2)
       if(max >= 0){
        return 0
       }else{
        return max
       }
      }catch(err){
        return 0
      }
    }

    const GetMartMaxDrawdownForInc = () =>{
      try{
        let min = Math.min(...rawMovementData.message.map(item => item.sharesValueInUSD + item.holdingUSD))
        let invested = rulesData.investment
        let max = (-(1-min/invested)*100).toFixed(2)
        if(max >= 0){
         return 0
        }else{
         return max
        }
       }catch(err){
         return 0
       }
    }

    const ruleDetails = () =>{
      switch(rulesData?.algoType){
        case 1:
          return (
              <MarFinal userData={rulesData}/>
          )

        case 2:
          return <DCAFinal userData={rulesData} />
        case 3:
          return <IndFinal userData={rulesData} />
        default:
          return (
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-5" role="alert">
              <strong class="font-bold">Error: </strong>
              <span class="block sm:inline">Something went wrong.</span>
            </div> 
          )
      }
    }

    const GetROI = (data) =>{
      try{
        return (-(1 - data[data.length - 1].sharesValueInUSD / data[data.length-1].usingUSD) * 100).toFixed(2)
      }catch(err){
        console.log(err)
        return 0
      }
    }

    const GetROIForInc = (data) =>{
      try{
        let invest = rulesData.investment
        let finalValue = (data[data.length - 1].sharesValueInUSD + data[data.length - 1].holdingUSD)
        return (-(1 - finalValue / invest) * 100).toFixed(2)
      }catch(err){
        console.log(err)
        return 0
      }
    }

    const GetROIforMart = (investment, finalValue) =>{
      try{
        // console.log(finalValue)
        // console.log(investment)
        return (-(1 - (finalValue / investment)) * 100).toFixed(2)
      }catch(err){
        console.log(err)
        return 0
      }
    }

    const getTradeCount = (data) =>{
      try{
        let count = 0
        for (let i in data.message){
          if(data.message[i].order != "None"){
            count += 1
          }
        }
        return count
      }catch(err){
        console.log(err)
        return 0
      }
    }

    const GetBuySellRecordForInc = (data) =>{
      try{
        //get all the record that the order not equal to none
        const result = data.filter((record) => record.order !== "None");
        console.log("data")
        console.log(result)
        return result
      }catch(err){
        console.log(err)
        return []
      }
    }

    const renderInvestSummary = () =>{
      try{
        // console.log("hihi")
        // console.log(rawMovementData.objArr)
        // console.log("rule")
        // console.log(rulesData)
        if(rulesData.algoType == 1){
          //mart
          return (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 px-5 content-center'>
                {/* investment */}
                <div className='justify-center justify-self-center mt-5'>
                  <Card
                    title="Total Invested"
                    overrides={{
                      Title: {
                        style: ({ $theme }) => ({
                          fontSize:'1rem'
                        })
                      },
                      Root: {
                        style: ({ $theme }) => ({
                          width: '328px',
                          textAlign: 'center'
                        })
                      }
                    }}
                  >

                      <StyledBody>
                        <div className="flex flex-wrap px-10 items-center justify-center">
                          <div className=""><TbReportMoney style={{display:'inline'}} color={'#5FC27E'} size={40}/></div>
                          <div className="grid grid-rows-1 pl-1">
                            <div className=" text-start text-2xl">{Math.ceil(rulesData.investment)}</div>
                          </div>
                        </div>
                      </StyledBody>
                    </Card>
                </div>
                {/* maximum drawdown */}
                <div className='justify-center justify-self-center mt-5'>
                  <Card
                    title={"Maximum Drawdown"}
                    overrides={{
                      Title: {
                        style: ({ $theme }) => ({
                          fontSize:'1rem'
                        })
                      },
                      Root: {
                        style: ({ $theme }) => ({
                          width: '328px',
                          textAlign: 'center'
                        })
                      }
                    }}
                  >
                    <StyledBody>
                      <div className="flex flex-wrap px-10 items-center justify-center">
                        <div className="">
                          <AiOutlineArrowDown color={'#F44455'} size={40}/>
                        </div>
                        <div className="grid grid-rows-1">
                          <div className=" text-start text-2xl text-[#F44455]">{GetMartMaxDrawdown()}%</div>
                        </div>
                      </div>
                    </StyledBody>
                  </Card>
                </div>
                {/* Current value of your Coin */}
                <div className='justify-center justify-self-center mt-5'>
                  <Card
                      title={"Holding " + (rulesData.type == 1 ? "Coin" : "Shares") + " Value"}
                      overrides={{
                        Title: {
                          style: ({ $theme }) => ({
                            fontSize:'1rem'
                          })
                        },
                        Root: {
                          style: ({ $theme }) => ({
                            width: '328px',
                            textAlign: 'center'
                          })
                        }
                      }}
                    >
                    <StyledBody>
                      <div className="flex flex-wrap px-10 items-center justify-center">
                        <div className=""><MdOutlineAttachMoney style={{display:'inline'}} color={'#00ACED'} size={40}/></div>
                        <div className="grid grid-rows-1">
                          <div className=" text-start text-2xl">{(movementData[movementData.length-1].value).toFixed(2)}</div>
                        </div>
                      </div>
                    </StyledBody>
                  </Card>
                </div>
                {/*profit*/}
                <div className='justify-center justify-self-center mt-5'>
                  <Card
                      title="Return on Investment (ROI)"
                      overrides={{
                        Title: {
                          style: ({ $theme }) => ({
                            fontSize:'1rem'
                          })
                        },
                        Root: {
                          style: ({ $theme }) => ({
                            width: '328px',
                            textAlign: 'center'
                          })
                        }
                      }}
                    >

                    <StyledBody>
                      <div className="flex flex-wrap px-10 items-center justify-center">
                        <div className="">
                          {
                          GetROIforMart(rulesData.investment, movementData[movementData.length-1].value) < 0 ? <AiOutlineArrowDown color={'#F44455'} size={40}/> : <AiOutlineArrowUp color={'#45B668'} size={40}/>
                          }
                        </div>
                        <div className="grid grid-rows-1">
                          <div className={"text-start text-2xl" + (GetROIforMart(rulesData.investment, movementData[movementData.length-1].value) < 0 ? " text-[#F44455]" : " text-[#45B668]")}>{GetROIforMart(rulesData.investment, movementData[movementData.length-1].value)}%</div>
                        </div>
                      </div>
                    </StyledBody>
                  </Card>
                </div>
              </div>
              {/* conclude */}
              <div className='w-auto'>
                <p className=' font-semibold m-5 text-xl' >
                  You turn&nbsp; 
                  <span className='text-[#45B668]'>${rulesData.investment}</span>
                  &nbsp; into &nbsp; 
                  <span className={rulesData.investment <= movementData[movementData.length-1].value ? 'text-[#45B668]': 'text-[#F44455]'}>${(movementData[movementData.length-1].value).toFixed(2)}</span>
                </p>
              </div>
            </div>
          )
        }else if(rulesData.algoType == 2){
          //dca
          return (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 px-5 content-center'>
                  {/* investment */}
                  <div className='justify-center justify-self-center mt-5'>
                    <Card
                      title="Total Invested"
                      overrides={{
                        Title: {
                          style: ({ $theme }) => ({
                            fontSize:'1rem'
                          })
                        },
                        Root: {
                          style: ({ $theme }) => ({
                            width: '328px',
                            textAlign: 'center'
                          })
                        }
                      }}
                    >

                        <StyledBody>
                          <div className="flex flex-wrap px-10 items-center justify-center">
                            <div className=""><TbReportMoney style={{display:'inline'}} color={'#5FC27E'} size={40}/></div>
                            <div className="grid grid-rows-1 pl-1">
                              <div className=" text-start text-2xl">{(movementData.message[movementData.message.length-1].usingUSD)?.toFixed(2)}</div>
                            </div>
                          </div>
                        </StyledBody>
                      </Card>
                  </div>
                  {/* coin/shares purchased */}
                  <div className='justify-center justify-self-center mt-5'>
                    <Card
                      title={rulesData.type == 1 ? "Coin ": "Shares" + " purchased"}
                      overrides={{
                        Title: {
                          style: ({ $theme }) => ({
                            fontSize:'1rem'
                          })
                        },
                        Root: {
                          style: ({ $theme }) => ({
                            width: '328px',
                            textAlign: 'center'
                          })
                        }
                      }}
                    >
                      <StyledBody>
                        <div className="flex flex-wrap px-10 items-center justify-center">
                          <div className="w-1/3">
                            {rulesData.type == 1 ? 
                            <BsCoin style={{display:'inline'}} color={'#FCC100'} size={40}/> 
                            : 
                            <CgShutterstock style={{display:'inline'}} color={'#FCC100'} size={40}/>}
                          </div>
                          <div className="grid grid-rows-1">
                            <div className=" text-start text-2xl">{APICall.HandleGetCoinToFixed(movementData.message[movementData.message.length-1].holdingShare, rulesData.pair)}</div>
                          </div>
                        </div>
                      </StyledBody>
                    </Card>
                  </div>
                  {/* Current value of your Coin */}
                  <div className='justify-center justify-self-center mt-5'>
                    <Card
                        title={"Holding " + (rulesData.type == 1 ? "Coin" : "Shares") + " Value"}
                        overrides={{
                          Title: {
                            style: ({ $theme }) => ({
                              fontSize:'1rem'
                            })
                          },
                          Root: {
                            style: ({ $theme }) => ({
                              width: '328px',
                              textAlign: 'center'
                            })
                          }
                        }}
                      >
                      <StyledBody>
                        <div className="flex flex-wrap px-10 items-center justify-center">
                          <div className=""><MdOutlineAttachMoney style={{display:'inline'}} color={'#00ACED'} size={40}/></div>
                          <div className="grid grid-rows-1">
                            <div className=" text-start text-2xl">{(movementData.message[movementData.message.length-1].sharesValueInUSD).toFixed(2)}</div>
                          </div>
                        </div>
                      </StyledBody>
                    </Card>
                  </div>
                  {/*profit*/}
                  <div className='justify-center justify-self-center mt-5'>
                    <Card
                        title="Return on Investment (ROI)"
                        overrides={{
                          Title: {
                            style: ({ $theme }) => ({
                              fontSize:'1rem'
                            })
                          },
                          Root: {
                            style: ({ $theme }) => ({
                              width: '328px',
                              textAlign: 'center'
                            })
                          }
                        }}
                      >

                      <StyledBody>
                        <div className="flex flex-wrap px-10 items-center justify-center">
                          <div className="">
                            {
                            GetROI(movementData.message) < 0 ? <AiOutlineArrowDown color={'#F44455'} size={40}/> : <AiOutlineArrowUp color={'#45B668'} size={40}/>
                            }
                          </div>
                          <div className="grid grid-rows-1">
                            <div className={"text-start text-2xl" + (GetROI(movementData.message) < 0 ? " text-[#F44455]" : " text-[#45B668]")}>{GetROI(movementData.message)}%</div>
                          </div>
                        </div>
                      </StyledBody>
                    </Card>
                  </div>
              </div>
              <div className='w-auto'>
                <p className=' font-semibold m-5 text-xl' >
                  You turn&nbsp; 
                  <span className='text-[#45B668]'>${(movementData.message[movementData.message.length-1].usingUSD)?.toFixed(2)}</span>
                  &nbsp; into &nbsp; 
                  <span className={movementData.message[movementData.message.length-1].usingUSD <= (movementData.message[movementData.message.length-1].sharesValueInUSD) ? 'text-[#45B668]': 'text-[#F44455]'}>${(movementData.message[movementData.message.length-1].sharesValueInUSD)?.toFixed(2)}</span>
                </p>
              </div>          
            </div>
          )
          
        }else if(rulesData.algoType == 3){
          return(
            <div>
                <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 px-5 content-center'>
                  {/* investment */}
                  <div className='justify-center justify-self-center mt-5'>
                    <Card
                      title="Total Invested"
                      overrides={{
                        Title: {
                          style: ({ $theme }) => ({
                            fontSize:'1rem'
                          })
                        },
                        Root: {
                          style: ({ $theme }) => ({
                            width: '328px',
                            textAlign: 'center'
                          })
                        }
                      }}
                    >

                        <StyledBody>
                          <div className="flex flex-wrap px-10 items-center justify-center">
                            <div className=""><TbReportMoney style={{display:'inline'}} color={'#5FC27E'} size={40}/></div>
                            <div className="grid grid-rows-1 pl-1">
                              <div className=" text-start text-2xl">{rulesData.investment}</div>
                            </div>
                          </div>
                        </StyledBody>
                      </Card>
                  </div>

                    {/* Trade */}
                    <div className='justify-center justify-self-center mt-5'>
                    <Card
                      title="No. Trade"
                      overrides={{
                        Title: {
                          style: ({ $theme }) => ({
                            fontSize:'1rem'
                          })
                        },
                        Root: {
                          style: ({ $theme }) => ({
                            width: '328px',
                            textAlign: 'center'
                          })
                        }
                      }}
                    >

                        <StyledBody>
                          <div className="flex flex-wrap px-10 items-center justify-center">
                            <div className=""><BsCurrencyExchange style={{display:'inline'}} color={'#5FC27E'} size={40}/></div>
                            <div className="grid grid-rows-1 pl-1">
                              <div className=" text-start text-2xl">{getTradeCount(rawMovementData)}</div>
                            </div>
                          </div>
                        </StyledBody>
                      </Card>
                  </div>
                  {/* holding USD*/}
                  <div className='justify-center justify-self-center mt-5'>
                    <Card
                      title={"Holding USD"}
                      overrides={{
                        Title: {
                          style: ({ $theme }) => ({
                            fontSize:'1rem'
                          })
                        },
                        Root: {
                          style: ({ $theme }) => ({
                            width: '328px',
                            textAlign: 'center'
                          })
                        }
                      }}
                    >
                      <StyledBody>
                        <div className="flex flex-wrap px-10 items-center justify-center">
                          <div className="w-1/3">
                            <MdOutlineAttachMoney style={{display:'inline'}} color={'#00ACED'} size={40}/>
                          </div>
                          <div className="grid grid-rows-1">
                            <div className=" text-start text-2xl">{(movementData.message[movementData.message.length-1].holdingUSD).toFixed(2)}</div>
                          </div>
                        </div>
                      </StyledBody>
                    </Card>
                  </div>
                  {/* Current value of your Coin */}
                  <div className='justify-center justify-self-center mt-5'>
                    <Card
                        title={"Holding " + (rulesData.type == 1 ? "Coin" : "Shares") + " Value"}
                        overrides={{
                          Title: {
                            style: ({ $theme }) => ({
                              fontSize:'1rem'
                            })
                          },
                          Root: {
                            style: ({ $theme }) => ({
                              width: '328px',
                              textAlign: 'center'
                            })
                          }
                        }}
                      >
                      <StyledBody>
                        <div className="flex flex-wrap px-10 items-center justify-center">
                          <div className="">
                            {rulesData.type == 1 ? 
                              <BsCoin style={{display:'inline'}} color={'#FCC100'} size={40}/> 
                              : 
                              <CgShutterstock style={{display:'inline'}} color={'#FCC100'} size={40}/>}
                          </div>
                          <div className="grid grid-rows-1">
                            <div className=" text-start text-2xl">{(movementData.message[movementData.message.length-1].sharesValueInUSD).toFixed(2)}</div>
                          </div>
                        </div>
                      </StyledBody>
                    </Card>
                  </div>
                  {/* maximum drawdown */}
                  <div className='justify-center justify-self-center mt-5'>
                    <Card
                      title={"Maximum Drawdown"}
                      overrides={{
                        Title: {
                          style: ({ $theme }) => ({
                            fontSize:'1rem'
                          })
                        },
                        Root: {
                          style: ({ $theme }) => ({
                            width: '328px',
                            textAlign: 'center'
                          })
                        }
                      }}
                    >
                      <StyledBody>
                        <div className="flex flex-wrap px-10 items-center justify-center">
                          <div className="">
                            <AiOutlineArrowDown color={'#F44455'} size={40}/>
                          </div>
                          <div className="grid grid-rows-1">
                            <div className=" text-start text-2xl text-[#F44455]">{GetMartMaxDrawdownForInc()}%</div>
                          </div>
                        </div>
                      </StyledBody>
                    </Card>
                  </div>
                  {/*profit*/}
                  <div className='justify-center justify-self-center mt-5'>
                    <Card
                        title="Return on Investment (ROI)"
                        overrides={{
                          Title: {
                            style: ({ $theme }) => ({
                              fontSize:'1rem'
                            })
                          },
                          Root: {
                            style: ({ $theme }) => ({
                              width: '328px',
                              textAlign: 'center'
                            })
                          }
                        }}
                      >

                      <StyledBody>
                        <div className="flex flex-wrap px-10 items-center justify-center">
                          <div className="">
                            {
                            GetROIForInc(movementData.message) < 0 ? <AiOutlineArrowDown color={'#F44455'} size={40}/> : <AiOutlineArrowUp color={'#45B668'} size={40}/>
                            }
                          </div>
                          <div className="grid grid-rows-1">
                            <div className={"text-start text-2xl" + (GetROIForInc(movementData.message) < 0 ? " text-[#F44455]" : " text-[#45B668]")}>{GetROIForInc(movementData.message)}%</div>
                          </div>
                        </div>
                      </StyledBody>
                    </Card>
                  </div>
                </div>
                <div className='w-full font-semibold m-5 text-xl'>
                      You turn&nbsp; 
                      <span className='text-[#45B668]'>${rulesData.investment}</span>
                      &nbsp; into &nbsp; 
                      <span className={rulesData.investment <= (movementData.message[movementData.message.length-1].sharesValueInUSD + movementData.message[movementData.message.length-1].holdingUSD) ? 'text-[#45B668]': 'text-[#F44455]'}>${(movementData.message[movementData.message.length-1].sharesValueInUSD + movementData.message[movementData.message.length-1].holdingUSD).toFixed(2)}</span>
                </div>
            </div>

          )
        }

      }catch(err){
        console.log(err)
        return <></>
      }
    }

    const renderMove = () =>{
      try{
        if(rulesData.algoType == 1 ){
          console.log("move")
          console.log(movementData)
          return (<ProfitMovementChart data={movementData} ruleData={rulesData} rawData={rawMovementData.objArr}/>)
        } else if (rulesData.algoType == 2){
          return (<DCAMovementChart data={movementData} ruleData={rulesData} rawData={rawMovementData.objArr}/>)
        }else if(rulesData.algoType == 3){
          // console.log("move")
          // console.log(movementData)
          return (
            <ProfitMovementChart data={incMovementData} ruleData={rulesData} rawData={rawMovementData}/>
            // <>3</>
          )
        }else{
          return(
            <div>4</div>
          )
        }
      }catch(err){
        console.log(err)
        return <></>
      }
    }

    const DCAGetOnlyBuyOrder = (data) =>{
      try{
        let result = []
        for (let i in data){
          if(data[i].order == "Buy"){
            result.push(data[i])
          }
        }
        console.log("result")
        console.log(result)
        return result
      }catch(err){
        console.log(err)
        return []
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
            {renderMove()}

          </div>

          <p className=' font-semibold text-cyan-600 mx-5 text-sm mt-5' >Investment Summary</p>
          <div>
              {renderInvestSummary()}
          </div>


          <hr/>
          <p className=' font-semibold text-cyan-600 mx-5 text-sm pt-5' >Buy / Sell Record</p>
          <div className='grid grid-cols-1'>
            
            {rulesData?.algoType == 1 ? 
              <ExecutionTable data={rawSimulationData} rules={rulesData}/> 
              : 
              rulesData?.algoType == 2 ? 
                <ExecutionTableForDCA data={DCAGetOnlyBuyOrder(rawSimulationData)} rules={rulesData}/>
              :
              rulesData?.algoType == 3 ?
              <ExecutionTableForInc data={GetBuySellRecordForInc(rawSimulationData)} rules={rulesData}/>
              :
              <>4</>
          }
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