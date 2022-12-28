import React from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import {Button} from '../components';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import backgroundImg from '../data/bg.jpg'
import { useStateContext } from '../contexts/ContextProvider';



const Dashboard = () => {
  const { currentColor, currentMode } = useStateContext();
  return (
    <div className="mt-20 md:mt-5">
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5 mt-5'>
        <div className='container bg-white dark:bg-gray-900'>

          <div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
              <div className="place-self-center mr-auto lg:col-span-7">
                  <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white">Simulation Game</h1>
                  <p className="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                     Algorithm Trading Simulation Game (TODO) Description ... ...
                  </p>
                  <a href="/GameInit" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                      Get Started
                  </a> 
              </div>
              <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                  <img src={backgroundImg} alt="mockup"/>
              </div>                
          </div>
          
          {/* <div className=' flex flex-row justify-center'>
            <div className='grow justify-center'>
              <h1 className='m'>Algorithm  Trading Game</h1>
            </div>
            <div className='grow '>123</div>

          </div> */}
        </div>
      </div>
      {/* <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Earnings</p>
              <p className="text-2xl">$63,448.78</p>
            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <BsCurrencyDollar />
            </button>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor={currentColor}
              text="Download"
              borderRadius="10px"
            />
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Dashboard