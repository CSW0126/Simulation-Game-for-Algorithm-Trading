import React, {useContext} from 'react'
import { StepperContext } from '../../../../contexts/StepperContext'
import DCAFinal from './DCAFinal';
import IndFinal from './IndFinal';
import MarFinal from './MarFinal';

const Final = () => {
  const {userData} = useContext(StepperContext)

  const ReturnScreen = ()=>{
    if (userData.algoType == 1){
      return <MarFinal userData={userData}/>
    }else if (userData.algoType == 2){
      return <DCAFinal userData={userData}/>
    }else if (userData.algoType == 3){
      return <IndFinal userData={userData}/>
    }else{
      return (<>Error</>)
    }
  }

  return (
    <div className='grid grid-cols-1 gap-4 justify-items-center'>
      {ReturnScreen()}
    </div>

  )
}

export default Final