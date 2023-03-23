import React from 'react';
import backgroundImg from '../data/bg.jpg'

const Dashboard = () => {
  return (
    <div className="mt-20 md:mt-5" data-aos="fade-up">
      <div className='shadow-xl rounded-2xl pd-2 bg-white p-5 mx-5 mt-5'>
        <div className='container bg-white dark:bg-gray-900'>
          <div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
              <div className="place-self-center mr-auto lg:col-span-7">
                  <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white">Simulation Game</h1>
                  <p className="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 text-justify">
                    This game allows players to simulate the process of algorithmic trading in a virtual environment. Players can create and test their own trading algorithms, analyze market data, and make virtual trades.
                  </p>
                  <p className="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 text-justify">
                    These games often use historical market data to provide a realistic trading experience.By providing a low-risk, simulated environment for practicing and refining trading strategies, these games can help players improve their skills and knowledge of algorithmic trading.
                  </p>
                  <a href="/GameInit" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                      Get Started
                  </a> 
              </div>
              <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                  <img src={backgroundImg} alt="mockup"/>
              </div>                
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard