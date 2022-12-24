import React, { useState, useEffect } from 'react'
import LineChart from '../components/Charts/LineChart'
import Stepper from '../components/Form/Stepper'
import StepperControl from '../components/Form/StepperControl'
import AlgoSelect from '../components/Form/Steps/AlgoSelect'
import Final from '../components/Form/Steps/Final'
import MarRules from '../components/Form/Steps/MarRules'
import PickTrade from '../components/Form/Steps/PickTrade'
import { StepperContext } from '../contexts/StepperContext'
import moment from 'moment';
import APICall from '../apiCall/API'
import Cookies from 'js-cookie'
import { useRef } from 'react'
import DCARules from '../components/Form/Steps/DCARules'
import CusRules from '../components/Form/Steps/CusRules'
import { Button } from "baseui/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';
import { useNavigate  } from "react-router-dom";

const GameInit = () => {
  const scrollRef = useRef(null)
  const topScrollRef = useRef(null)
  const [userData, setUserData] = useState('');
  const [showChart, setShowChart] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [historicalData, setHistoricalData] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  let navigate  = useNavigate();
  const close = () =>{
    setIsOpen(false)
  }
  const steps = [
    "Pick an asset",
    "Strategy",
    "Rules",
    "Finish"
  ]

  useEffect(() =>{
    console.log(userData)
  },[userData])

  const handlePreview = async(scroll) => {
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
      const historicalData = APICall.ReturnDataProcessor(result.message)
      console.log(historicalData)
      setHistoricalData(historicalData)
      setShowChart(true)
      if(scroll){
        scrollRef.current.scrollIntoView() 
      }
    }else{
      console.log("Fail Request")
      console.log(result)
      alert("Error! Check console log!")
    }
  }

  const scrollToTop = () =>{
    topScrollRef.current.scrollIntoView()
  }

  const displayStep = (step)=>{
    switch(step){
      case 1:
        return <PickTrade/>
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
    if (direction === "next"){
        newStep++
        if(currentStep == 1){
          handlePreview(true)
        }else{
          scrollToTop()
        }
    } else if(direction === "back"){
      newStep--
    } else if(direction === "confirm"){
      setIsOpen(true)
    }
    newStep > 0 && newStep<= steps.length && setCurrentStep(newStep)
  }

  const handleConfirm = async()=>{
    try{
      let obj = {
        token :Cookies.get('_auth'),
        data : userData
      }
      const response = await APICall.AsyncGetSimulation(obj)
      console.log(response)
      // navigate("/history");
    }catch(err){
      console.log(err)
    }
  }
  
  return (
    <div className='mb-10'>
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
          {showChart ? (         
              <div>
                  <LineChart
                    // currentData = {initialData}
                    candData = {historicalData}
                  ></LineChart>
              </div>


              
          ): (<></>)}
        <div className='container horizontal mt-5'>
          <Stepper 
            steps = {steps}
            currentStep = {currentStep}
          />
          
          <div className='my-5 p-5' ref={topScrollRef}>
            <StepperContext.Provider value={{
              userData,
              setUserData,
              historicalData,
              setHistoricalData
            }}>
              {displayStep(currentStep)}
            </StepperContext.Provider>
          </div>

        </div>
          <StepperContext.Provider value={{
              userData,
              setUserData,
              historicalData,
              setHistoricalData
            }}>
            <StepperControl 
              handleClick = {handleClick}
              currentStep={currentStep}
              steps={steps}
            />
          </StepperContext.Provider>

          {userData.type === 1 && currentStep === 1 ? (          
            <div className='mt-5 mb-2 ml-10'>
                  <Button onClick={() => handlePreview(false)}>Preview Chart</Button>
            </div>
          ) : (<></>)

          }
      </div>
      <Modal onClose={close} isOpen={isOpen}>
        <ModalHeader>Confirm Simulation</ModalHeader>
        <ModalBody>
          All the data will be sent to the server to do the simulation. Your account balance will be change according to the simulation result.
        </ModalBody>
        <ModalFooter>
          <ModalButton kind="tertiary" onClick={close}>
            Cancel
          </ModalButton>
          <ModalButton onClick={()=>handleConfirm()}>Confirm</ModalButton>
        </ModalFooter>
      </Modal>
      <div ref={scrollRef}></div>
    </div>

  )
}

export default GameInit