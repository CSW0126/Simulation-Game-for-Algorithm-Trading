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



const CusRules = () => {
  const initRules = {
    expression1:{type: "Close Price", value:""},
    operator:">",
    expression2: {type: "Number", value: "1"}
  }
  const initGroup = {
    // And / Not / Count
    type: "And",
    value: 0,
    rules: [initRules]
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
      value: 'Open Price',
      label: 'Open Price',
    },
    {
      value: 'High Price',
      label: 'High Price',
    },
    {
      value: 'Low Price',
      label: 'Low Price',
    },
    {
      value: 'Volume',
      label: 'Volume',
    },
    {
      value: 'Number',
      label: 'Number',
      param: {
        value:0
      }
    },
    {
      value: "SMA",
      label: 'Simple Moving Average (SMA)',
      param:{
        timePeriod: 10
      }
    }
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
  const [algorithm, setAlgorithm] = useState([initGroup]);
  const [ex1, setEx1] = useState([expression.filter(item => item.value != "Number" )])
  const [ex2, setEx2] = useState([expression.filter(item => item.value != "Close Price" )])

  useEffect(()=>{
    console.log("algo")
    console.log(algorithm)
    // console.log(ex1)
    // console.log(ex2)
  },[algorithm, ex1, ex2])

  // Add Group
  const handleAddGroup = () =>{
    try{
      const tempGroup = [...algorithm, initGroup]
      setAlgorithm(tempGroup)
    }catch(err){
      console.log(err)
    }
  }

  // Remove Group
  const handleRemoveGroup =(groupIndex) =>{
    try{
      const tempGroup = [...algorithm]
      tempGroup.splice(groupIndex, 1)
      setAlgorithm(tempGroup)
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
      const tempRules = [...tempGroup, initRules]
      const tempEx1 = [...ex1, expression.filter(item => item.value != "Number" )]
      const tempEx2 = [...ex2, expression.filter(item => item.value != "Close Price" )]
    }catch(err){
      console.log(err)
    }
    // const temp = [...algorithm, initRules]
    // const tempEx1 = [...ex1, expression.filter(item => item.value != "Number" )]
    // const tempEx2 = [...ex2, expression.filter(item => item.value != "Close Price" )]

    // setAlgorithm(temp)
    // setEx1(tempEx1)
    // setEx2(tempEx2)
  }

  const handleRemoveRules = (groupIndex, ruleIndex) =>{
    // const deleteTemp = [...algorithm]
    // const deleteEx1 = [...ex1]
    // const deleteEx2 = [...ex2]

    // deleteTemp.splice(i, 1)
    // deleteEx1.splice(i, 1)
    // deleteEx2.splice(i, 1)

    // setAlgorithm(deleteTemp)
    // setEx1(deleteEx1)
    // setEx2(deleteEx2)
  }

  const handleExpressionOneChange = (value, groupIndex, ruleIndex) =>{
    // const temp = [...algorithm]
    // const ex2Temp = [...ex2]
    // const newEx2 = expression.filter(item => item.value != value );

    // temp[i].expression1.type = value
    // ex2Temp[i] = newEx2

    // setEx2(ex2Temp)
    // setAlgorithm(temp)
  }

  const handleExpressionTwoChange = (value, groupIndex, ruleIndex)=>{
    // const temp = [...algorithm]
    // const ex1Temp = [...ex1]
    // const newEx1 = expression.filter(item => item.value != value );

    // temp[i].expression2.type = value
    // ex1Temp[i] = newEx1

    // setEx1(ex1Temp)
    // setAlgorithm(temp)
  }

  const handleOperatorChange = (value, groupIndex, ruleIndex)=>{
    // const temp = [...algorithm]
    // temp[i].operator = value
    // setAlgorithm(temp)
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
        {/* group */}
        {algorithm.map((group, i)=>(
            <div className=' border py-5 border-slate-600 rounded-lg p-5'>
                <span className=' text-lg ml-5 mb-3'>Group {i} Type: </span>
                {/* group remove button */}
                {i == 0 ? <></> : <Button onClick={()=>handleRemoveGroup(i)}>Remove Group</Button>}
                {/* group operator */}
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

                {/* rules */}
                {group.rules.map((rules, j) =>(
                  <div>
                    <div className='flex flex-wrap'>
                      <div>{j}</div>
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
                                {ex1[j].map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                ))}
                          </TextField>
                      </div>
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
                                {ex2[j].map((option)=>(
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                ))}
                          </TextField>
                      </div>
                      {/* remove rule */}
                      {j == 0 ? <></>: 
                        <Button onClick={()=>handleRemoveRules(i,j)}>Remove</Button>
                      }
                    </div>
                  </div>

                ))}
                {/* add rule */}
                 <Button onClick={()=>handleAddRules(i)}>Add Rules</Button>
            </div>
        ))}

        <Button onClick={handleAddGroup}>Add Group</Button>
  </Box>
  )
}

export default CusRules