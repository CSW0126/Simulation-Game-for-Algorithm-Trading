import React from 'react'
import moment from 'moment'

const DCAFinal = ({userData}) => {
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
              <span className=' font-semibold text-gray-600 text-base'>Invest Period</span>
            </div>
            <div>
              <span className=' text-gray-600 text-base'>
                {userData.period} Day(s)
              </span>
            </div>
        </div>

        <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
            <div className=''>
              <span className=' font-semibold text-gray-600 text-base'>Investment every time</span>
            </div>
            <div>
              <span className=' text-gray-600 text-base'>
                {userData.type == 1? "$": ""}{userData.DCAInvestAmount}{userData.type==1? " USD" : " Shares"}
              </span>
            </div>
        </div>

        <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
            <div className=''>
              <span className=' font-semibold text-gray-600 text-base'>Total Investment</span>
            </div>
            <div>
              <span className=' text-gray-600 text-base'>
                {userData.type == 1? "$": ""}{userData.DCAInvestAmount * Math.ceil(userData.validDate / userData.period)}{userData.type == 1? " USD": " Shares"}
              </span>
            </div>
        </div>

        {/* <div className='ml-5 py-5 grid grid-cols-2 gap-4 border-t-1 border-gray-300'>
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
        </div> */}

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
      </div>
    </div>
  )
}

export default DCAFinal