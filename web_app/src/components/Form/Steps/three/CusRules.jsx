import React, {useContext, useEffect, useState} from 'react'
import { StepperContext } from '../../../../contexts/StepperContext'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Cookies from 'js-cookie'
import InputAdornment from '@mui/material/InputAdornment';
import {Button} from 'baseui/button';
import Plus from 'baseui/icon/plus'
import Delete from 'baseui/icon/delete'
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import {DatePicker} from 'baseui/datepicker';
import { Collapse } from '@mui/material';



const CusRules = () => {
  const initRules = {
    expression1:{type: "Close Price", param:{}},
    operator:">",
    expression2: {type: "Number", param:{value:1}}
  }
  const initGroup = {
    // And / Not / Count
    type: "And",
    value: 0,
    rules: []
  }

  const groupType = [
    {
      value: 'And',
      label: 'And',
    },
    {
      value: 'Not',
      label: 'Not',
    },
    {
      value: 'Count',
      label: 'Count',
    },
  ]

  const expression = [
    {
      value: 'Close Price',
      label: 'Close Price',
    },
    {
      value: `Prev Close Price`,
      label: `Prev. Day's Close Price`,
    },
    {
      value: 'Open Price',
      label: 'Open Price',
    },
    {
      value: `Prev Open Price`,
      label: `Prev. Day's Open Price`,
    },
    {
      value: 'High Price',
      label: 'High Price',
    },
    {
      value: `Prev High Price`,
      label: `Prev. Day's High Price`,
    },
    {
      value: 'Low Price',
      label: 'Low Price',
    },
    {
      value: `Prev Low Price`,
      label: `Prev. Day's Low Price`,
    },
    {
      value: 'Volume',
      label: 'Volume',
    },
    {
      value: `Prev Volume`,
      label: `Prev. Day's Volume`,
    },

    {
      value: 'Number',
      label: 'Number',
      param: {
        value:1
      },
    },
    {
      value: '%',
      label: '%',
      param: {
        value:1
      },
    },
    {
      value: "SMA",
      label: 'Simple Moving Average (SMA)',
      param:{
        timePeriod: 10
      }
    },
    {
      value: "RSI",
      label: 'Relative Strength Index (RSI)',
      param:{
        timePeriod: 10
      }
    },
    {
      value: "SO",
      label: 'Stochastic Oscillator',
      param:{
        value: 10
      }
    },
    {
      value: "MACD",
      label: 'Moving Average Convergence Divergence (MACD)',
      param:{
        FastEMAPeriod: 10,
        SlowEMAPeriod:10,
        SignalLinePeriod:10

      }
    },
  ];

  const operator = [
    {
      value: '>',
      label: '>',
    },
    {
      value: '>=',
      label: '>=',
    },
    {
      value: '=',
      label: '=',
    },
    {
      value: '<',
      label: '<',
    },
    {
      value: '<=',
      label: '<=',
    },
  ]
  const {userData, setUserData, historicalData} = useContext(StepperContext)
  const [openBuy, setOpenBuy] = useState(true)
  const [openSell, setOpenSell] = useState(true)
  const [algorithm, setAlgorithm] = useState([initGroup]);
  const [ex1, setEx1] = useState([
    [expression.filter(item => item.value != "Number" )]
  ])
  const [ex2, setEx2] = useState([[expression.filter(item => item.value != "Close Price")]])

  useEffect(()=>{
    // console.log("algo")
    console.log(algorithm)
    // console.log(ex1)
    // console.log(ex2)
  },[algorithm, ex1, ex2])

  // Add Group
  const handleAddGroup = () =>{
    try{
      const tempGroup = [...algorithm, initGroup]
      const tempEx1 = [...ex1, [expression.filter(item => item.value != "Number" )]]
      const tempEx2 = [...ex2, [expression.filter(item => item.value != "Close Price")]]
      setAlgorithm(tempGroup)
      setEx1(tempEx1)
      setEx2(tempEx2)
    }catch(err){
      console.log(err)
    }
  }

  // Remove Group
  const handleRemoveGroup =(groupIndex) =>{
    try{
      const tempGroup = [...algorithm]
      const tempEx1 = [...ex1]
      const tempEx2 = [...ex2]

      tempGroup.splice(groupIndex, 1)
      tempEx1.splice(groupIndex, 1)
      tempEx2.splice(groupIndex, 1)

      setAlgorithm(tempGroup)
      setEx1(tempEx1)
      setEx2(tempEx2)
    }catch(err){
      console.log(err)
    }
  }

  // Change Group Rules
  const handleGroupRule = (value, groupIndex)=>{
    try{
      const tempGroup = [...algorithm]
      tempGroup[groupIndex].type = value
      if (value == 'Count'){tempGroup[groupIndex].value = 1}
      setAlgorithm(tempGroup)
    }catch(err){
      console.log(err)
    }
  }

  // Change Group Count Value
  const handleCountValueChange = (groupIndex, value)=>{
    try{
      const tempGroup = [...algorithm]
      tempGroup[groupIndex].value = value
      setAlgorithm(tempGroup)
    }catch(err){
      console.log(err)
    }
  }

  // add rules
  const handleAddRules = (groupIndex) =>{
    try{
      const tempGroup = [...algorithm]
      tempGroup[groupIndex].rules.push(initRules)
      const tempEx1 = [...ex1]
      const tempEx2 = [...ex2]

      tempEx1[groupIndex].push(expression.filter(item => item.value != "Number" ))
      tempEx2[groupIndex].push(expression.filter(item => item.value != "Close Price" ))

      setAlgorithm(tempGroup)
      setEx1(tempEx1)
      setEx2(tempEx2)
    }catch(err){
      console.log(err)
    }
  }

  // remove rules
  const handleRemoveRules = (groupIndex, ruleIndex) =>{
    try{
      const tempGroup = [...algorithm]
      const tempEx1 = [...ex1]
      const tempEx2 = [...ex2]

      tempGroup[groupIndex].rules.splice(ruleIndex,1)
      tempEx1[groupIndex].splice(ruleIndex,1)
      tempEx2[groupIndex].splice(ruleIndex,1)

      setAlgorithm(tempGroup)
      setEx1(tempEx1)
      setEx2(tempEx2)

    }catch(err){
      console.log(err)
    }
  }

  const exFilter = (value) =>{
    try{
      if(value == 'RSI'){
        return expression.filter(item =>item.value == "Number")
      }else{
        return expression.filter(item =>item.value != value)
      }

    }catch(err){
      console.log(err)
      return expression.filter(item => item.value != value );
    }
  }

  // exp1
  const handleExpressionOneChange = (value, groupIndex, ruleIndex) =>{
    try{
      console.log("group"+groupIndex+'rule'+ruleIndex)
      let tempGroup = [...algorithm]
      let tempEx2 = [...ex2]
      let newEx2 = exFilter(value);
      let exObj = expression.filter(item => item.value == value)

      tempEx2[groupIndex][ruleIndex] = newEx2
      tempGroup[groupIndex].rules[ruleIndex].expression1 = {
        type: value,
        param: exObj[0].param
      }

      if(value == "RSI"){
        tempGroup[groupIndex].rules[ruleIndex].expression2 = {type: "Number", param: {value: 1}}
      } 

      setAlgorithm(tempGroup)
      setEx2(tempEx2)
    }catch(err){
      console.log(err)
    }
  }

  //exp2
  const handleExpressionTwoChange = (value, groupIndex, ruleIndex)=>{
    try{
      let tempGroup = [...algorithm]
      let tempEx1 = [...ex1]
      let newEx1 = exFilter(value);
      let exObj = expression.filter(item => item.value == value)

      tempEx1[groupIndex][ruleIndex] = newEx1
      tempGroup[groupIndex].rules[ruleIndex].expression2 = {
        type: value,
        param: exObj[0].param
      }

      if(value == "RSI"){
        tempGroup[groupIndex].rules[ruleIndex].expression1 = {type: "Number", param: {value: 1}}
      } 

      setAlgorithm(tempGroup)
      setEx1(tempEx1)
    }catch(err){
      console.log(err)
    }
  }

  //operator
  const handleOperatorChange = (value, groupIndex, ruleIndex)=>{
    try{
      const tempGroup = [...algorithm]
      tempGroup[groupIndex].rules[ruleIndex].operator = value
      setAlgorithm(tempGroup)
    }catch(err){
      console.log(err)
    }
  }

  //renderExpParam
  const renderExpParam = (value, groupIndex, rulesIndex, position) =>{
    try{
      //param change
      const handleParamChange = (value, key) =>{
        try{
          const tempGroup = [...algorithm]
          if(position == 1){
            tempGroup[groupIndex].rules[rulesIndex].expression1.param[key] = value
          }else if(position == 2){
            tempGroup[groupIndex].rules[rulesIndex].expression2.param[key] = value
          }
          setAlgorithm(tempGroup)
        }catch(err){
          console.log(err)
        }
      }

      //max and width
      let max = 999
      let width = 150

      if(position == 1){
        max = algorithm[groupIndex].rules[rulesIndex].expression2.type == "Volume" ? 9999999999 : 999
        if(algorithm[groupIndex].rules[rulesIndex].expression2.type == "RSI"){
          max = 100
        }
        // width = algorithm[groupIndex].rules[rulesIndex].expression2.type == "Volume" ? 150 : 100
      }else if(position == 2){
        max = algorithm[groupIndex].rules[rulesIndex].expression1.type == "Volume" ? 9999999999 : 999
        // width = algorithm[groupIndex].rules[rulesIndex].expression1.type == "Volume" ? 150 : 100
        if(algorithm[groupIndex].rules[rulesIndex].expression1.type == "RSI"){
          max = 100
        }
      }

      if(value.param != undefined){
        const keys = Object.keys(value.param)
        return(
          <div key={value.type+groupIndex+"_"+rulesIndex}>
            {keys.map((key, i)=>(
              <div key={value.type+"_"+groupIndex+"_"+rulesIndex+"_"+i+"_"+position}>
                  <TextField
                    label={key}
                    sx={{ m: 1, width: 300 }}
                    style = {{width}}
                    type="number"
                    color="secondary"
                    InputProps={{
                      inputProps: { min: 1, max: max }
                    }}
                    value={value.param[key]}
                    onChange={(e)=>{
                      if (e.target.value > max) {
                        handleParamChange(max, key, groupIndex, rulesIndex)
                      }else{
                        handleParamChange(e.target.value, key, groupIndex, rulesIndex)
                      }
                      
                    }}
                    onBlur={(e)=>{
                      let value = Math.round(e.target.value)
                      value <= 0 ? handleParamChange(1, key, groupIndex, rulesIndex) : handleParamChange(value, key, groupIndex, rulesIndex)
                    }}
                />
              </div>
            ))}
          </div>

        )
      }
    }catch(err){
      console.log(err)
    }
  }




  return (
    <Box
        component="div"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        className='animate__animated animate__fadeIn '>
          {/* Buy rules button */}
          <div className='mb-5'>
              <button className="bg-green-300 text-green-700 font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={()=>setOpenBuy(!openBuy)}>
                  <span className="mr-2">Buy Rules</span>
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6L14 10L6 14V6Z" />
                  </svg>
              </button>  
          </div>

         <div>
            <Collapse in={openBuy} timeout="auto" unmountOnExit>
                {/* group */}
                {algorithm.map((group, i)=>(
                    <div className=' border py-5 border-slate-600 rounded-lg p-5 mb-5' key={"Group_"+i}>
                        <div className='flex flex-wrap mb-5'>
                          <div className='self-center '>
                              <span className='text-lg ml-5 font-bold'>Group #{i} &nbsp;&nbsp;&nbsp;</span>
                          </div>

                            {/* group remove button */}

                            {i == 0 ? <></> : 
                            <div>
                              <button className="bg-red-300 text-red-700 font-bold py-2 px-4 rounded inline-flex items-center my-3"
                                      onClick={()=>handleRemoveGroup(i)}>
                                  <span className="mr-2">Remove Group</span>
                                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.348 14.849L10.196 10.697L14.348 6.546C14.742 6.151 14.742 5.516 14.348 5.121C13.954 4.727 13.319 4.727 12.924 5.121L8.772 9.273L4.621 5.121C4.226 4.727 3.591 4.727 3.197 5.121C2.803 5.516 2.803 6.151 3.197 6.546L7.348 10.697L3.197 14.849C2.803 15.243 2.803 15.878 3.197 16.273C3.389 16.465 3.627 16.562 3.864 16.562C4.101 16.562 4.339 16.465 4.531 16.273L8.682 12.121L12.834 16.273C13.026 16.465 13.264 16.562 13.501 16.562C13.738 16.562 13.976 16.465 14.168 16.273C14.562 15.878 14.562 15.243 14.168 14.849Z" />
                                  </svg>
                              </button>
                            </div>
                              }
                        </div>
                        {/* group operator */}
                        <div className='flex flex-wrap justify-start ml-2'>
                            <TextField
                              select
                              label="Group Operator"
                              defaultValue= {"And"}
                                onChange={(event)=>handleGroupRule(event.target.value, i)
                              }
                              value={group.type}
                              >
                              {groupType.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                              ))}
                          </TextField>

                          {/* group count value */}
                          {group.type == 'Count' ? 
                            <TextField
                                label="Min"
                                sx={{ m: 1, width: '25ch' }}
                                // defaultValue={item.share}
                                type="number"
                                InputProps={{
                                  inputProps: { min: 1, max: 100 }
                                }}
                                value={group.value}
                                onChange={(e)=>{
                                  if (e.target.value > 100) {
                                    handleCountValueChange(i, 100)
                                  }else{
                                    handleCountValueChange(i, e.target.value)
                                  }
                                  
                                }}
                                onBlur={(e)=>{
                                  let value = Math.round(e.target.value)
                                  value <= 0 ? handleCountValueChange(i, 1) : handleCountValueChange(i, value)
                                }}
                            />
                          :<></>}
                        </div>
                        <div className='py-5'>
                          <hr className=''/>
                        </div>


                        {/* rules */}
                        {group.rules.map((rules, j) =>(
                          <div key={"Group_"+i+"_Rule"+j}>
                            <div className='flex flex-wrap'>
                              <div className=' justify-center self-center'>
                                  <span className='text-lg ml-5 font-bold'>Rules #{j}</span>
                              </div>
                              {/* expression 1 */}
                              <div>                    
                                <TextField
                                        select
                                        label="Expression 1"
                                        defaultValue= {"Close Price"}
                                          onChange={(event)=>handleExpressionOneChange(event.target.value, i, j)
                                        }
                                        value={rules.expression1.type}
                                        >
                                        {ex1[i][j].map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                              {option.label}
                                            </MenuItem>
                                        ))}
                                  </TextField>
                              </div>
                              {renderExpParam(rules.expression1, i, j, 1)}
                              {/* operator */}
                              <div>
                                  <TextField
                                        select
                                        label="Operator"
                                        defaultValue= {">"}
                                          onChange={(event)=>handleOperatorChange(event.target.value, i, j)
                                        }
                                        value={rules.operator}
                                        >
                                        {operator.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                              {option.label}
                                            </MenuItem>
                                        ))}
                                  </TextField>
                              </div>
                              {/* expression 2 */}
                              <div>
                                  <TextField
                                        select
                                        label="Expression 2"
                                        defaultValue= {rules.expression2.type}
                                          onChange={(event)=>handleExpressionTwoChange(event.target.value, i, j)
                                        }
                                        value={rules.expression2.type}
                                        >
                                        {ex2[i][j].map((option)=>(
                                            <MenuItem key={option.value} value={option.value}>
                                              {option.label}
                                            </MenuItem>
                                        ))}
                                  </TextField>
                              </div>
                              {renderExpParam(rules.expression2, i, j, 2)}
                              {/* remove rule */}
                              {j == 0 ? <></>: 
                              
                                <button className="bg-red-300 text-red-700 font-bold py-2 px-4 rounded inline-flex items-center my-3"
                                        onClick={()=>handleRemoveRules(i,j)}>
                                    <span className="mr-2">Remove Rule</span>
                                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M14.348 14.849L10.196 10.697L14.348 6.546C14.742 6.151 14.742 5.516 14.348 5.121C13.954 4.727 13.319 4.727 12.924 5.121L8.772 9.273L4.621 5.121C4.226 4.727 3.591 4.727 3.197 5.121C2.803 5.516 2.803 6.151 3.197 6.546L7.348 10.697L3.197 14.849C2.803 15.243 2.803 15.878 3.197 16.273C3.389 16.465 3.627 16.562 3.864 16.562C4.101 16.562 4.339 16.465 4.531 16.273L8.682 12.121L12.834 16.273C13.026 16.465 13.264 16.562 13.501 16.562C13.738 16.562 13.976 16.465 14.168 16.273C14.562 15.878 14.562 15.243 14.168 14.849Z" />
                                    </svg>
                                </button>
                                // <Button onClick={()=>handleRemoveRules(i,j)}>Remove</Button>
                              }
                            </div>
                          </div>

                        ))}
                        {/* add rule */}
                        <div className='flex flex-wrap justify-start mt-3 mx-4'>
                          <Button onClick={()=>handleAddRules(i)}>Add Rules</Button>
                        </div>

                    </div>
                ))}
                <div className='flex flex-wrap justify-center'>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={handleAddGroup}>
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8V7a1 1 0 012 0v3h3a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3H6a1 1 0 010-2h3z"/>
                    </svg>
                    Add Buy Condition Group
                  </button>
                </div>

            </Collapse>
         </div>
         <div className='my-5'>
            <hr/>
         </div>

        
  </Box>
  )
}

export default CusRules