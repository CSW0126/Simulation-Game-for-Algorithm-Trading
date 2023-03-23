import React, {useEffect} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from 'react-auth-kit';
import {useIsAuthenticated} from 'react-auth-kit';
import {Navbar, Sidebar} from './components'
import {Dashboard, GameInit, History, Profile, LeaderBoard} from'./pages'
import Login from './Auth/Login'
import SignUp from './Auth/SignUp'
import './App.css'
import { useStateContext } from './contexts/ContextProvider';
import Record from './pages/Record';
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  const {activeMenu} = useStateContext();
  const isAuthenticated = useIsAuthenticated()
  useEffect(() => {
    AOS.init()
  }, [])
  return (
    <div>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
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

                  {/* Dashboard */}
                  <Route path={"/"} element={
                    <RequireAuth loginPath='/login'>
                      <Dashboard/>
                    </RequireAuth>
                  }/>

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

                  {/* LeaderBoard */}
                  <Route path="/LeaderBoard" element={
                    <RequireAuth loginPath='/login'>
                      <LeaderBoard/>
                    </RequireAuth>
                  } />

                  {/* Profile */}
                  {/* <Route path="/Profile" element={
                    <RequireAuth loginPath='/login'>
                      <Profile/>
                    </RequireAuth>
                  } /> */}
                  
                </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App