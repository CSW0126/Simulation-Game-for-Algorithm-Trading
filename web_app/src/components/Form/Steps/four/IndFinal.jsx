import React, { useEffect } from 'react'
import moment from 'moment'

const IndFinal = ({userData}) => {
  useEffect(()=>{
    // console.log("Info")
    // console.log(userData)
  },[])

  const renderParam = (value) =>{
    try{
      // console.log(value)
      let keys = Object.keys(value)
      let str = ""
      for(let i in keys){
        str += keys + ": " + value[keys[i]]
      }

      if(str){ str = "- " + str}
      return str
    }catch(err){
      console.log(err)
    }
  }

  const renderRules = (rules) =>{
    if(rules.expression1.type == "MACD"){
      return(
        <div className='w-full'>
          <p className='text-center'>{rules.expression1.type}</p>
          {/* <p className='text-center'>Fast EMA Period: <span className='font-semibold'>{rules.expression1.param.FastEMAPeriod}</span> days </p>
          <p className='text-center'>Slow EMA Period: <span className='font-semibold'>{rules.expression1.param.SlowEMAPeriod}</span> days</p>
          <p className='text-center'>Signal Line Period: <span className='font-semibold'>{rules.expression1.param.SignalLinePeriod}</span> days</p> */}
        </div>
      )
    }else if (rules.expression2.type == "MACD"){
      return(
        <div className='w-full'>
          <p className='text-center'>{rules.expression1.type}</p>
          {/* <p className='text-center'>Fast EMA Period: <span className='font-semibold'>{rules.expression1.param.FastEMAPeriod}</span> days </p>
          <p className='text-center'>Slow EMA Period: <span className='font-semibold'>{rules.expression1.param.SlowEMAPeriod}</span> days</p>
          <p className='text-center'>Signal Line Period: <span className='font-semibold'>{rules.expression1.param.SignalLinePeriod}</span> days</p> */}
        </div>
      )
    }else{
      return(
        <>      
          <span className={"w-2/6 text-center"}>{rules.expression1.type} {renderParam(rules.expression1.param)}</span>
          <span className={"w-1/6 text-center"}>{rules.operator}</span>
          <span className={"w-2/6 text-center"}>{rules.expression2.type} {renderParam(rules.expression2.param)}</span>
        </>
      )
    }


  }
  return (
    <div className='mb-10 min-w-[70%]' >
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
        <p className=' font-semibold text-cyan-600 m-5 text-xl' >Parameters</p>
        <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
            <div className='w-1/4'>
              <span className=' font-semibold text-gray-600 text-base'>Market Type:</span>
            </div>
            <div className='w-full md:w-3/4'>
              <span className=' text-gray-600 text-base'>
                {userData.type == 1 ? "Crypto" : userData.type == 2 ? "Stock" : "error"}
              </span>
            </div>
        </div>

        <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
            <div className='w-full md:w-1/4'>
              <span className=' font-semibold text-gray-600 text-base'>Assets:</span>
            </div>
            <div>
              <span className=' text-gray-600 text-base'>
                {userData.pair}
              </span>
            </div>
        </div>

        <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
            <div className='w-full md:w-1/4'>
              <span className=' font-semibold text-gray-600 text-base'>Algorithm:</span>
            </div>
            <div className='w-full md:w-1/4'>
              <span className=' text-gray-600 text-base'>
                {userData.algoType == 1 ? "Martingale" : userData.algoType == 2 ? "Dollar-Cost Averaging" : userData.algoType == 3 ? "Custom" : "error"}
              </span>
            </div>
        </div>

        <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Investment</span>
          </div>
          <div>
            <span className=' text-gray-600 text-base'>
              ${userData.investment}
            </span>
          </div>
      </div>

        <div className='ml-5 py-5 flex flex-wrap justify-center border-t-1 border-gray-300'>
            <div className='text-center'>
              <span className=' font-semibold text-green-600 text-base'>Buy Rules</span>
            </div>
        </div>


        {userData.buyCondition.map((group, i)=>(
          <div key={"buy_"+i}  className='ml-5 py-5 flex flex-wrap border-t-1 border-gray-300'>
            <div className='w-full md:w-1/4 font-semibold text-gray-600'>Group #{i}</div>
            <div className={"w-full font-base"+ group.type == "Count"? "md:w-1/4" : "w-3/4"}>Condition: <span className=''>&nbsp;{(group.type).toUpperCase()}</span></div>
            {group.type == "Count" ? <div className='w-full md:w-2/4 font-base'>Value: {group.value}</div>: <></>}
            
            {/* rules */}
            {group.rules.map((rules, j)=>(
              <div className='w-full ml-5 py-5 mt-3 flex flex-wrap border-t-1 border-gray-300'>
                <span className='font-semibold text-gray-600 w-full md:w-1/6'>Rule #{j}:</span> 
                {renderRules(rules)}
              </div>
            ))}
          </div>
        ))}
        <div className='ml-5 py-5 flex flex-wrap justify-center border-t-1 border-gray-300'>
          <div className='text-center'>
            <span className=' font-semibold text-red-600 text-base'>Sell Rules</span>
          </div>
        </div>

        {userData.sellCondition.map((group, i)=>(
          <div key={"buy_"+i}  className='ml-5 py-5 flex flex-wrap border-t-1 border-gray-300'>
            <div className='w-full md:w-1/4 font-semibold text-gray-600'>Group #{i}</div>
            <div className={"w-full font-base"+ group.type == "Count"? "md:w-1/4" : "w-3/4"}>Condition: <span className=''>&nbsp;{(group.type).toUpperCase()}</span></div>
            {group.type == "Count" ? <div className='w-full md:w-2/4 font-base'>Value: {group.value}</div>: <></>}
            
            {/* rules */}
            {group.rules.map((rules, j)=>(
              <div className='w-full ml-5 py-5 mt-3 flex flex-wrap border-t-1 border-gray-300'>
                <span className='font-semibold text-gray-600 w-full md:w-1/6'>Rule #{j}:</span> 
                {renderRules(rules)}
              </div>
            ))}
          </div>
        ))}

        <div className='ml-5 py-5 flex flex-wrap justify-center border-t-1 border-gray-300'>
          <div className='text-center'>
            <span className=' font-semibold text-blue-600 text-base'>Risk Management</span>
          </div>
        </div>

        <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Stop Loss:</span>
          </div>
          <div>
            <span className=' text-gray-600 text-base'>
              {userData.stop_loss}%
            </span>
          </div>
      </div>

      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Stop Earn:</span>
          </div>
          <div>
            <span className=' text-gray-600 text-base'>
              {userData.stop_earn}%
            </span>
          </div>
      </div>
      </div>
    </div>
  )
}

export default IndFinal