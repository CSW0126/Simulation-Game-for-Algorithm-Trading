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

const initAlgo = {
  expression1: "price",
  operator: ">",
  expression2 : ""

}

const CusRules = () => {
  const {userData, setUserData, historicalData} = useContext(StepperContext)
  const {algo, setAlgo} = useState({})

  const expression = [
    {
      value: 'close price',
      label: 'close Price',
    },
    {
      value: 'open price',
      label: 'open price',
    },
    {
      value: 'high price',
      label: 'high price',
    },
    {
      value: 'low price',
      label: 'low price',
    },
    {
      value: 'Volume',
      label: 'Volume',
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

  const [algorithm, setAlgorithm] = useState([]);


  useEffect(()=>{
    console.log(algorithm)
  },[algorithm])

  const handleAddRules = () =>{

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

      <div className=' border py-5 border-slate-600 rounded-lg p-5'>

        <Button onClick={handleAddRules}>Add Rules</Button>
      </div>

  </Box>
  )
}

export default CusRules