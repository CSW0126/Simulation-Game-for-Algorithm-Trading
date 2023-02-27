import React from 'react'
import moment from 'moment'

const MarFinal = ({userData}) => {
    const MarCalData = (target) =>{
        if(target == 'drawback'){
          try{
            let totalD = 1
            for(let item of userData.priceScaleData){
              if(item.priceScale > 0){
                totalD *= ((100 - item.priceScale)/100)
              }
            }
        
            totalD = (1- totalD) * 100
            totalD = totalD.toFixed(2)
            return totalD
          }catch(err){
            console.log(err)
            return "error"
          }
        }else if (target == 'shares'){
          try{
            let totalS = 0
            for(let item of userData.priceScaleData){
              totalS += item.share
            }
            return totalS
          }catch(err){
            console.log(err)
            return "error"
          }
        }else{
          return "no target"
        }
      }
  return (
  <div className='mb-10 min-w-[70%]' >
    <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5'>
      <p className=' font-semibold text-cyan-600 m-5 text-xl' >Parameters</p>
      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Market Type:</span>
          </div>
          <div>
            <span className=' text-gray-600 text-base'>
              {userData.type == 1 ? "Crypto" : userData.type == 2 ? "Stock" : "error"}
            </span>
          </div>
      </div>

      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Assets:</span>
          </div>
          <div>
            <span className=' text-gray-600 text-base'>
              {userData.pair}
            </span>
          </div>
      </div>

      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Algorithm:</span>
          </div>
          <div>
            <span className=' text-gray-600 text-base'>
              {userData.algoType == 1 ? "Martingale" : userData.algoType == 2 ? "Dollar-Cost Averaging" : userData.algoType == 3 ? "Custom" : "error"}
            </span>
          </div>
      </div>

      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Main Rules:</span>
          </div>
          <div>
            <div className='grid grid-cols-3 gap-3 pb-3'>
              <div className='px-2 text-center'><span className='text-gray-600 font-semibold text-sm'>Index</span></div>
              <div className='px-2 text-center'><span className='text-gray-600 font-semibold text-sm'>Drawback</span></div>
              <div className='px-2 text-center'><span className='text-gray-600 font-semibold text-sm'>Shares</span></div>
            </div>
              {userData.priceScaleData.map((item,index)=>(
                <div className='grid grid-cols-3 gap-3 border-t-1 border-gray-300' key={index}>
                  <div className='px-2 text-center'><span className='text-gray-600 text-sm'>#{item.index}</span></div>
                  <div className='px-2 text-center'><span className='text-gray-600 text-sm'>{item.priceScale}%</span></div>
                  <div className='px-2 text-center'><span className='text-gray-600 text-sm'>{item.share}</span></div>
                </div>
              ))}
          </div>
      </div>

      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Total Drawback %:</span>
          </div>
          <div>
            <span className=' text-gray-600 text-base'>
              {MarCalData('drawback')}%
            </span>
          </div>
      </div>

      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Total Shares :</span>
          </div>
          <div>
            <span className=' text-gray-600 text-base'>
              {MarCalData('shares')}
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

      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Take Profit Ratio:</span>
          </div>
          <div>
            <span className=' text-gray-600 text-base'>
              {userData.take_profit}%
            </span>
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

      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Date Range:</span>
          </div>
          <div>
              <div className=''>
                <span className='text-gray-600 font-semibold text-sm'>
                  {moment(userData.rangeDate[0]).format("YYYY-MM-DD")} 
                  &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
                  {moment(userData.rangeDate[1]).format("YYYY-MM-DD")}
                </span>
              </div>
          </div>
      </div>

      <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
          <div className=''>
            <span className=' font-semibold text-gray-600 text-base'>Price Range:</span>
          </div>
          <div>
            <div className=''>
              <span className='text-gray-600 font-semibold text-sm'>
                {userData.price_range_bot}
                &nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;
                {userData.price_range_up}
              </span>
            </div>
          </div>
      </div>

    </div>
  </div>
  )
}

export default MarFinal