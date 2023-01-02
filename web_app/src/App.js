import React, {useEffect} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { RequireAuth } from 'react-auth-kit';
import {useIsAuthenticated} from 'react-auth-kit';

import {Navbar, Footer, Sidebar, ThemeSettings} from './components'
import {Dashboard, GameInit, History} from'./pages'
import Login from './Auth/Login'
import SignUp from './Auth/SignUp'
import './App.css'
import { useStateContext } from './contexts/ContextProvider';
import Record from './components/Record';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
  const isAuthenticated = useIsAuthenticated()


    return (
      <div>
        <BrowserRouter>
          <div className="flex relative dark:bg-main-dark-bg">
            {/* <div className="fixed right-4 bottom-4 style={{zIndex:'1000'}}">
              <TooltipComponent content="Settings" position='Top'>
                <button
                  type="button"
                  onClick={() => setThemeSettings(true)}
                  style={{ background: currentColor, borderRadius: '50%' }}
                  className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                >
                  <FiSettings/>
                </button>
              </TooltipComponent>
            </div> */}
            {activeMenu ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                <Sidebar/> 
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar/> 
              </div>
            )}
            {/* navbar */}
            <div
              className={
                activeMenu
                  ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                  : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
              }
            >
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                <Navbar />
              </div>
              {/* routes div */}
              <div>
                  <Routes>

                    <Route path="/login" element={(<Login/>)} />
                    <Route path="/SignUp" element={(<SignUp/>)} />


                    <Route path={"/Dashboard"} element={
                      <RequireAuth loginPath='/login'>
                        <Dashboard/>
                      </RequireAuth>
                    }/>
                     {/* <Route path="/Dashboard" element={(<Dashboard/>)} /> */}

                    {/* Dashboard */}
                    <Route path={"/"} element={
                      <RequireAuth loginPath='/login'>
                        <Dashboard/>
                      </RequireAuth>
                    }/>
                    {/* <Route path="/Dashboard" element={
                        <RequireAuth loginPath='/login'>
                          (<Dashboard/>)
                        </RequireAuth>
                      }/> */}

                    {/* Game Dashboard */}
                    <Route path="/GameInit" element={
                      <RequireAuth loginPath='/login'>
                        <GameInit/>
                      </RequireAuth>
                      
                    } />

                    {/* Trade history */}
                    <Route path="/History" element={
                      <RequireAuth loginPath='/login'>
                        <History/>
                      </RequireAuth>
                    } />

                    {/* Trade Record */}
                    <Route path="/History/:id" element={
                      <RequireAuth loginPath='/login'>
                        <Record/>
                      </RequireAuth>
                    } />
                    
                  </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </div>
    )


}

export default App