import React, { useState } from 'react'
import LineChart from '../components/Charts/LineChart'
import Stepper from '../components/Form/Stepper'
import StepperControl from '../components/Form/StepperControl'
import AlgoSelect from '../components/Form/Steps/AlgoSelect'
import Final from '../components/Form/Steps/Final'
import MarRules from '../components/Form/Steps/MarRules'
import PickTrade from '../components/Form/Steps/PickTrade'
import { StepperContext } from '../contexts/StepperContext'
import moment from 'moment';
import APICall from '../apiCall/Stock'
import Cookies from 'js-cookie'
import { useRef } from 'react'
import DCARules from '../components/Form/Steps/DCARules'
import CusRules from '../components/Form/Steps/CusRules'

const GameInit = () => {
  const scrollRef = useRef(null)
  const [userData, setUserData] = useState('');
  const [finalData, setFinalData] = useState([])
  const [showChart, setShowChart] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [useableData, setUseableData] = useState([])
  const steps = [
    "Pick an asset",
    "Strategy",
    "Rules",
    "Finish"
  ]

  const handlePreview = async() => {
    let today = moment().format("YYYY-MM-DD")
    let twoYearsAgo = moment().add(-730, 'days').format("YYYY-MM-DD")
    let apiObject = {
      type:userData.type,
      ticker:userData.pair,
      from: twoYearsAgo,
      to: today,
      token: Cookies.get('_auth')
    }
    console.log(userData)
    console.log(apiObject)

    const result = await APICall.AsyncGetHistoricalData(apiObject)
    console.log(result)
    if (result.status === 'success'){
      const useableData = APICall.ReturnDataProcessor(result.message)
      console.log(useableData)
      setUseableData(useableData)
      setShowChart(true)
      scrollRef.current.scrollIntoView() 
    }else{
      console.log("Fail Request")
      console.log(result)
      alert("Error! Check console log!")
    }

  }

  const displayStep = (step)=>{
    switch(step){
      case 1:
        return <PickTrade
            handlePreview={handlePreview} 
            />
      case 2:
        return <AlgoSelect />
      case 3:
        if(userData.algoType === 1){
          return <MarRules />
        }else if(userData.algoType === 2){
          return <DCARules />
        }else if (userData.algoType === 3){
          return <CusRules />
        }else{
          return <></>
        }
      case 4:
        return <Final />
      default:
        <></>
    }
  }


  const handleClick = (direction) =>{
    let newStep = currentStep
    direction === "next"? newStep++: newStep--
    newStep > 0 && newStep<= steps.length && setCurrentStep(newStep)
  }
  
  return (
    <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
      <div className='container horizontal mt-5'>
        <Stepper 
          steps = {steps}
          currentStep = {currentStep}
        />

        <div className='my-10 p-10'>
          <StepperContext.Provider value={{
            userData,
            setUserData,
            finalData,
            setFinalData
          }}>
            {displayStep(currentStep)}
          </StepperContext.Provider>
        </div>


      </div>
        <StepperContext.Provider value={{
            userData,
            setUserData,
            finalData,
            setFinalData
          }}>
          <StepperControl 
            handleClick = {handleClick}
            currentStep={currentStep}
            steps={steps}
          />
        </StepperContext.Provider>

        {showChart ? (         
            <div>
                <LineChart
                  // currentData = {initialData}
                  candData = {useableData}
                ></LineChart>
            </div>


            
        ): (<></>)}
        <div ref={scrollRef}></div>
    </div>

  )
}

export default GameInit