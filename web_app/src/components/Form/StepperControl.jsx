import React, {useContext} from 'react'
import { StepperContext } from '../../contexts/StepperContext'

const StepperControl = ({handleClick, currentStep, steps}) => {
    const {userData, setUserData} = useContext(StepperContext)

    const btn = (
        <button className={`bg-cyan-500 text-black uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out`}
        onClick={()=>handleClick("next")}
        >
            {currentStep === steps.length ? "Confirm" : "Next"}
        </button>
    )

    const btnDisable = (
        <></>
    )

    const btnBack = (
        <button className={`bg-white text-slate-400 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${currentStep === 1? "opacity=50 cursor-not-allowed disabled":""}`}
            onClick={()=>handleClick("back")}>
            Back
        </button>
    )

    const handleBtnBack = () =>{
        if(currentStep===1){
            return btnDisable
        }else{
            return btnBack
        }
    }

    const handleBtnNext = () =>{
        if (currentStep === 1){
            if (userData.type && userData.pair){
                return btn
            }else{
                return btnDisable
            }
        }
    }
    return (
        <div className='container flex justify-around mt-4 mb-8'>
            {handleBtnBack()}
            {handleBtnNext()}
        </div>
    )
}

export default StepperControl