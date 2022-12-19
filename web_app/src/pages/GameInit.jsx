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

const GameInit = () => {
  // const initialData = [
  //   { time: '2018-12-22', value: 32.51 },
  //   { time: '2018-12-23', value: 31.11 },
  //   { time: '2018-12-24', value: 27.02 },
  //   { time: '2018-12-25', value: 27.32 },
  //   { time: '2018-12-26', value: 25.17 },
  //   { time: '2018-12-27', value: 28.89 },
  //   { time: '2018-12-28', value: 25.46 },
  //   { time: '2018-12-29', value: 23.92 },
  //   { time: '2018-12-30', value: 22.68 },
  //   { time: '2018-12-31', value: 22.67 },
  // ];
  // const candData = [
  //   { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
  //   { time: '2018-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
  //   { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
  //   { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
  //   { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
  //   { time: '2018-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
  //   { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
  //   { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
  //   { time: '2018-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
  //   { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
  // ]
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
        return <MarRules />
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
    </div>

  )
}

export default GameInit