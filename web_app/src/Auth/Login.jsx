import React from 'react'
import { useStateContext } from '../contexts/ContextProvider';

const Login = () => {
  const { currentColor, currentMode } = useStateContext();
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl text-black">
        <h1 className="text-3xl font-semibold text-center">
          Sign in
        </h1>
          <form className="mt-6">
              <div className="mb-2">
                  <label
                      htmlFor="username"
                      className="block text-sm font-semibold text-gray-800"
                  >Username
                  </label>
                  <input
                      type="text"
                      className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-cyan-400 focus:ring-cyan-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
              </div>
              <div className="mb-2">
                  <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-800"
                  >Password
                  </label>
                  <input
                      type="password"
                      className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-cyan-400 focus:ring-cyan-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
              </div>
              <div className="mt-6">
                  <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-cyan-500 rounded-md hover:bg-cyan-400 focus:outline-none focus:bg-cyan-400">
                      Login
                  </button>
              </div>
          </form>

          <p className="mt-8 text-xs font-light text-center text-gray-700">
              {" "}
              Don't have an account?{" "}
              <a
                  href="SignUp"
                  style={{color:currentColor}}
                  className="font-medium text-purple-600 hover:underline"
              >
                  Sign up
              </a>
          </p>
      </div>
    </div>
  )
}

export default Login