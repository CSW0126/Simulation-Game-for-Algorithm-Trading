import React, {useContext, useEffect, useState} from 'react'
import { StepperContext } from '../../../../contexts/StepperContext'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Cookies from 'js-cookie'
import InputAdornment from '@mui/material/InputAdornment';
import {Button} from 'baseui/button';
import Plus from 'baseui/icon/plus'
import Delete from 'baseui/icon/delete'
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import {DatePicker} from 'baseui/datepicker';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment'


const DCARules = () => {
  const {userData, setUserData, historicalData} = useContext(StepperContext)
  const maxStopEarn = 100000
  const maxInvestAmount = 1000
  const [validTradingDay, setValidTradingDay] = useState(0)

  const period = [
    {
      value: 1,
     label: "1 Day"
    },
    {
      value: 7,
     label: "7 Days"
    },
    {
      value: 14,
     label: "14 Days"
    },
    {
      value: 30,
     label: "30 Days"
    },
  ]

  const getDateStringFromHisDate  = (index) =>{
    try{
      let result = historicalData.data[index].time.year + '-' + historicalData.data[index].time.month + '-' + historicalData.data[index].time.day
      return new Date(result)
    }catch(err){
      console.log(err)
      return new Date()
    }
  } 
  const [rangeDate, setRangeDate] = useState(userData.rangeDate ? userData.rangeDate : [
    getDateStringFromHisDate(0),
    getDateStringFromHisDate(historicalData.data.length - 1)
  ]);

  useEffect(()=>{
    console.log(rangeDate)

    let amount = getTradingDay(rangeDate)
    if(amount){
      setValidTradingDay(amount)
    }

    if(rangeDate.length == 2){
      setUserData({
        ...userData,
        rangeDate : rangeDate,
        validDate: amount
      })
    }


  },[rangeDate])

  const convertHisDatetoString = (data) =>{
    return data.year + "-" + padWithLeadingZeros(data.month,2) + "-" + padWithLeadingZeros(data.day,2)
  }

  function padWithLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
  }

  const getTradingDay = (rangeDate) =>{
    try{
      let result = 0
      let startDay = moment(rangeDate[0]).format('YYYY-MM-DD')
      let endDay = moment(rangeDate[1]).format('YYYY-MM-DD')
  
      if(startDay == endDay){
        return 1
      }
  
      for (let i = 0; i < historicalData.data.length; i++){
        let temp = convertHisDatetoString(historicalData.data[i].time)
        if (moment(temp).isSameOrAfter(startDay) && moment(temp).isSameOrBefore(endDay) ){
          result += 1
        }
      }
      // setUserData({
      //   ...userData,
      //   vaildDate: result
      // })
      return result
    }catch(err){
      console.log(err)
    }
  }

  const hasMoreThanTwoDC = (num) =>{
    const parts = num.toString().split('.');
    if (parts.length < 2) return false;
    return parts[1].length > 2;
  }

  const handleStopLossChange = (value)=>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= 100) value = 100
        if(value <= 0.1) value = 0.1
        if(hasMoreThanTwoDC(value)) value = value.toFixed(2)
        setUserData({
          ...userData,
          stop_loss: value
        })
      }else{
        console.log("Not a number!")
      }
    }catch(err){
      console.log(err)
    }
  }

  const handleStopEarnChange = (value)=>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= maxStopEarn) value = maxStopEarn
        if(value < 0) value = 0
        if(hasMoreThanTwoDC(value)) value = value.toFixed(2)
        setUserData({
          ...userData,
          stop_earn: value
        })
      }else{
        console.log("Not a number!")
      }
    }catch(err){
      console.log(err)
    }
  }

  const handlePeriodChange = (value) =>{
      setUserData({
        ...userData,
        period:value
    })
  }

  const handleInvestAmountChange = (value) =>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= maxInvestAmount) value = maxInvestAmount
        if(value <= 1) value = 1
        value = value.toFixed(0)
        setUserData({
          ...userData,
          DCAInvestAmount: value
        })
      }else{
        console.log("Not a number!")
      }
    }catch(err){
      console.log(err)
    }
  }

  const calculateTotalInvestment = () =>{
    try{
      let amount = Math.floor(validTradingDay / userData.period) * userData.DCAInvestAmount
      return amount
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
        className='animate__animated animate__fadeIn '
      >
        <div className=' border py-5 border-slate-600 rounded-lg p-5'>
          <span className=' text-lg ml-5 mb-3'>Setup the DCA rules</span>
          <Tooltip title={
            <div>
              Select the buy period.
              <br/>
              <br/>Example: 
              <br/>&nbsp;&nbsp;Buy period = 1 day
              <br/>&nbsp;&nbsp;Buy amount = 10$ / 1 shares
              <br/>&nbsp;&nbsp;Then the bot will buy the amount of coin / shares every 1 trading day.
            </div>} placement="right">
              <IconButton>
                <HelpIcon/>
              </IconButton>
            </Tooltip>
            {/* period */}
            <div>
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Select"
                    defaultValue= {1}
                    // helperText="Please select your trading pair"
                    onChange={(event)=>handlePeriodChange(event.target.value)
                    }
                    value={userData.period}
                    >
                    {period.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>         
            </div>
            {/* invest amount */}
            <div className='flex flex-wrap justify-start mt-5 '>
              <div className='flex'>
                <TextField
                        label={`Amount (${userData.type == 1 ? "USD" : "Shares"})`}
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        type="number"
                        InputProps={{
                          inputProps: { min: 1, max: maxInvestAmount }
                        }}
                        value={userData.DCAInvestAmount}
                        onChange={(e)=>handleInvestAmountChange(e.target.value)}
                        onBlur={(e)=>{
                          if(e.target.value > maxInvestAmount){
                            handleInvestAmountChange(maxInvestAmount)
                          }
                        }}
                />
              </div>
              <div className='flex'>
                  <span className=' flex text-sm text-gray-900 my-auto'>Buy Amount of every trading.</span>            
              </div>
            </div>

            {/* date */}
            <div className='mx-2 mb-5'>
              <span className=' text-sm text-gray-900 my-auto'>Date Range:</span>
              <Tooltip title={"The algorithms use data from the date range "} placement="right">
                  <IconButton>
                    <HelpIcon/>
                  </IconButton>
                </Tooltip>
              <div className='mt-2'>
                <DatePicker
                  range
                  value={rangeDate}
                  onChange={({date}) => setRangeDate(date)}
                  placeholder="YYYY/MM/DD - YYYY/MM/DD"
                  minDate={getDateStringFromHisDate(0)}
                  maxDate={getDateStringFromHisDate(historicalData.data.length - 1)}
                  error={rangeDate.length == 2? false: true}
                />
              </div>
            </div>

            {/* cal value */}
            <div className='mt-5 ml-2'>
              <p className='text-sm text-gray-900'>Total Trading Day during the period : {validTradingDay} day(s)
                <Tooltip title={"Total Trading day during the period."} placement="right">
                  <IconButton>
                    <HelpIcon/>
                  </IconButton>
                </Tooltip>
              </p>
              <p className='text-sm text-gray-900'>Approximate amount of Investment required: { calculateTotalInvestment().toFixed(0)} {userData.type == 1 ? "USD" : "Shares"}
                <Tooltip title={"Approximate amount of investment required. (Due to the $ required to buy share may go up or down)"} placement="right">
                  <IconButton>
                    <HelpIcon/>
                  </IconButton>
                </Tooltip>
              </p>
            </div>

            {/* stop Earn */}
            {/* <div className='flex flex-wrap justify-start mt-5 '>
              <div className='flex'>
                <TextField
                        label="Stop Earning %"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        type="number"
                        InputProps={{
                          inputProps: { min: 0, max: maxStopEarn }
                        }}
                        value={userData.stop_earn}
                        onChange={(e)=>handleStopEarnChange(e.target.value)}
                        onBlur={(e)=>{
                          if(e.target.value > maxStopEarn){
                            handleStopEarnChange(maxStopEarn)
                          }
                        }}
                />
              </div>
              <div className='flex'>
                  <span className=' flex text-sm text-gray-900 my-auto'>Stop algorithm when earning hit this value.</span>            
                  <Tooltip title={"e.g. Investment: $100, \nbuy price: $100, Stop Earning %: 10%, when the value of your holding is $110, Your assets will be sold and game end. (0 will never stop)"} placement="right">
                  <IconButton>
                    <HelpIcon/>
                  </IconButton>
                </Tooltip>
              </div>
            </div> */}

            {/* stop loss */}
            {/* <div className='flex flex-wrap justify-start '>
              <div className='flex'>
                <TextField
                        label="Stop Loss -%"
                        id="outlined-start-adornment"
                        sx={{ m: 1, width: '25ch' }}
                        type="number"
                        InputProps={{
                          inputProps: { min: 0.1, max: 100 }
                        }}
                        value={userData.stop_loss}
                        onChange={(e)=>handleStopLossChange(e.target.value)}
                        onBlur={(e)=>{
                          if(e.target.value > 100){
                            handleStopLossChange(100)
                          }
                        }}
                />
              </div>
              <div className='flex'>
                  <span className=' flex text-sm text-gray-900 my-auto'>Stop loss when hit this value.</span>            
                  <Tooltip title={"e.g. Investment: $100, \nbuy price: $100, Stop Loss %: 10%, when the value of your holding is $90, Your assets will be sold in order to stop loss. (100% will never stop loss)"} placement="right">
                  <IconButton>
                    <HelpIcon/>
                  </IconButton>
                </Tooltip>
              </div>
            </div> */}
            
        </div>
      </Box>
  )
}

export default DCARules