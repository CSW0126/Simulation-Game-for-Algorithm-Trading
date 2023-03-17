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
      if(value){
        let keys = Object.keys(value)
        let str = ""
        for(let i in keys){
          str += keys + ": " + value[keys[i]]
        }

        if(str){ str = "- " + str}
        return str
      }

    }catch(err){
      console.log(err)
    }
  }

  const renderRules = (rules, order, text) =>{

    if((rules.expression1.type == "MACD" || rules.expression2.type == "MACD") && order != "Not"){
      return(
        <>        
          {"MACD (" + text + " Signal)"}
        </>
      )
    }else if ((rules.expression1.type == "MACD" || rules.expression2.type == "MACD") && order == "Not"){
      return(
        <>
          {"MACD No function in " + order + " Group"}
        </>
      )
    }else{
      return(
        <>      
          {rules.expression1.type} {renderParam(rules.expression1.param)}
          {" " + rules.operator + " "}
          {rules.expression2.type} {renderParam(rules.expression2.param)}
        </>
      )
    }
  }

  const renderTypeStr = (group)=>{
    try{
      switch (group.type){
        case "And":
          return "(And) Pass when all rules in this group should be satisfied."
        case "Not":
          return "(Not) If one of the rules is satisfied, no order will not be executed."
        case "Count":
          let value = group.value
          return `(Count) Pass when only satisfied at least ${value} rules.`
        default:
          return ""
      }
    }catch(err){
      console.log(err)
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
          <div key={"buy_"+i} className='flex flex-col bg-gray-100 border-t border-b border-gray-300 py-2 px-4'>
            <div  className='flex items-center'>
              <div className='text-lg font-semibold text-gray-700'>Group#{i}</div>
              <div className={"ml-4 text-sm text-gray-500"}>{renderTypeStr(group)}</div>
            </div>
            {/* rules */}
            <ul className="list-disc list-inside mt-5">
              {group.rules.map((rules, j)=>(
                <li key={"buy_"+i+"_rule_"+j} className="border-l-4 border-gray-300 pl-4 py-2 mb-2">
                  Rule {j}: &nbsp;{renderRules(rules, group.type, "Buy")}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className='ml-5 py-5 flex flex-wrap justify-center border-t-1 border-gray-300'>
          <div className='text-center'>
            <span className=' font-semibold text-red-600 text-base'>Sell Rules</span>
          </div>
        </div>

        {userData.sellCondition.map((group, i)=>(
          <div key={"sell_"+i}  className='flex flex-col bg-gray-100 border-t border-b border-gray-300 py-2 px-4'>
            <div className='flex items-center'>
              <div className='text-lg font-semibold text-gray-700'>Group #{i}</div>
              <div className={"ml-4 text-sm text-gray-500"}>{renderTypeStr(group)}</div>
            </div>
            
            {/* rules */}
            <ul className="list-disc list-inside mt-5">
            {group.rules.map((rules, j)=>(
              <li key={"sell_"+i+"_rule_"+j} className="border-l-4 border-gray-300 pl-4 py-2 mb-2">
                  Rule {j}: &nbsp;{renderRules(rules, group.type, "Sell")}
                </li>
            ))}
            </ul>
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