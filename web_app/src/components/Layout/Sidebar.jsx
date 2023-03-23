import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineStock, AiOutlineHistory } from 'react-icons/ai';
import { MdOutlineCancel } from 'react-icons/md';
import { MdDashboard, MdOutlineLeaderboard } from "react-icons/md";
import { BiGame } from "react-icons/bi";
import { VscSignIn } from "react-icons/vsc"
import { TfiWrite } from "react-icons/tfi"
import { ImProfile } from "react-icons/im"
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../../contexts/ContextProvider';
import { Button } from "baseui/button";
import {useIsAuthenticated} from 'react-auth-kit';
import {useSignOut} from "react-auth-kit"

const Sidebar = () => {
  const isAuthenticated = useIsAuthenticated()
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
  const signOut = useSignOut()
  let navigate  = useNavigate();
  const links = [
    {
      title: 'Dashboard',
      links: [
        {
          name: 'Dashboard',
          link: 'Dashboard',
          icon: <MdDashboard />,
        },
      ],
    },
    {
      title: 'Game',
      links: [
        {
          name: 'New Game',
          link: 'GameInit',
          icon: <BiGame />,
        },
      ],
    },
    {
      title: 'History',
      links: [
        {
          name: 'History',
          link:'History',
          icon: <AiOutlineHistory />,
        },
      ],
    },
    {
      title: 'Ranking',
      links: [
        {
          name: 'Leader Board',
          link:'LeaderBoard',
          icon: <MdOutlineLeaderboard />,
        },
      ],
    },
    // {
    //   title: 'Profile',
    //   links: [
    //     {
    //       name: 'My Profile',
    //       link:'Profile',
    //       icon: <ImProfile />,
    //     },
    //   ],
    // }
  ]

  const auth_links = [
    {
      title: "Registration",
      links: [
        {
          name: 'SignIn',
          link: 'login',
          icon: <VscSignIn />,
        },
        {
          name: 'SignUp',
          link: 'SignUp',
          icon: <TfiWrite />,
        },
      ] 
    }

  ]
  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const handleLogout = ()=>{
    signOut()
    navigate('/login')
  }

  const nav_map = () =>{
    return (
      links.map((item)=>(
        <div key={item.title}>
          <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
            {item.title}
          </p>
          {item.links.map((link) => (
            <NavLink
              to={`/${link.link}`}
              key={link.name}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({
                backgroundColor: isActive ? currentColor : '',
              })}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              {link.icon}
              <span className="capitalize ">{link.name}</span>
            </NavLink>
          ))}
        </div>
      ))
    )
  }

  const non_auth_nav_map = () =>{
    return (
      auth_links.map((item)=>(
        <div key={item.title}>
          <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
            {item.title}
          </p>
          {item.links.map((link) => (
            <NavLink
              to={`/${link.link}`}
              key={link.name}
              onClick={handleCloseSideBar}
              style={({ isActive }) => ({
                backgroundColor: isActive ? currentColor : '',
              })}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              {link.icon}
              <span className="capitalize ">{link.name}</span>
            </NavLink>
          ))}
        </div>
      ))
    )
  }


  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={() =>{}} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <AiOutlineStock /> <span>Simulation Game</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>

          <div className="mt-10 ">
            {isAuthenticated() ? nav_map() : non_auth_nav_map()}
            {isAuthenticated() ? 
            (
              <div 
                className='flex center gap-5 pl-4 pt-3 pb-2.5 rounded-lg m-2 mt-10'  
              >
                <Button onClick={() => handleLogout()}>Logout</Button>
              </div>
            ): (
              <></>
            )}

          </div>
        </>
      )}


    </div>
  )

}

export default Sidebar