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
  const maxStopEarn = 100000
  const initRules = {
    expression1:{type: "Close Price", param:{}},
    operator:">",
    expression2: {type: "Number", param:{value:1}}
  }
  const initGroup = {
    type: "And",
    value: 0,
    rules: [{
      expression1:{type: "Close Price", param:{}},
      operator:">",
      expression2: {type: "Number", param:{value:1}}
    }]
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
      toolTip:['Close Price of the current day']
    },
    {
      value: `Prev Close Price`,
      label: `Prev. Day's Close Price`,
      toolTip:['Close Price of the previous day']
    },
    {
      value: 'Open Price',
      label: 'Open Price',
      toolTip:['Open Price of the current day']
    },
    {
      value: `Prev Open Price`,
      label: `Prev. Day's Open Price`,
      toolTip:['Open Price of the previous day']
    },
    {
      value: 'High Price',
      label: 'High Price',
      toolTip:['High Price of the current day']
    },
    {
      value: `Prev High Price`,
      label: `Prev. Day's High Price`,
      toolTip:['High Price of the previous day']
    },
    {
      value: 'Low Price',
      label: 'Low Price',
      toolTip:['Low Price of the current day']
    },
    {
      value: `Prev Low Price`,
      label: `Prev. Day's Low Price`,
      toolTip:['Low Price of the previous day']
      
    },
    {
      value: 'Volume',
      label: 'Volume',
      toolTip:['Volume of the current day']
    },
    {
      value: `Prev Volume`,
      label: `Prev. Day's Volume`,
      toolTip:['Volume of the previous day']
    },

    {
      value: 'Number',
      label: 'Number',
      param: {
        value:1
      },
      toolTip:['Integer or Decimal Number greater than 0']
    },
    {
      value: "SMA",
      label: 'Simple Moving Average (SMA)',
      param:{
        timePeriod: 10
      },
      toolTip: [`Simple Moving Average (SMA) is a technical indicator that calculates the average price of a security over a specified time period and is commonly used to identify trends and support/resistance levels in financial markets.`,'SMA is calculated by adding up the prices over the specified time period and dividing by the number of periods.']
    },
    {
      value: "EMA",
      label: "Exponential Moving Average (EMA)",
      param:{
        timePeriod: 10
      },
      toolTip:[`Exponential Moving Average (EMA) is a technical analysis indicator that calculates the average price of a security over a specified time period, giving more weight to recent prices and reacting more quickly to price changes compared to Simple Moving Average (SMA).`,`EMA = (Price(t) * k) + (EMA(y) * (1 - k))`,`Where:`,'- Price(t) = the current price',`-EMA(y) = the previous EMA value`,`- k = 2/(N+1), where N is the number of periods used in the calculation`]
    },
    {
      value: "ADX",
      label: " Average Directional Index (ADX)",
      toolTip:[`The Average Directional Index (ADX) is a technical indicator used to measure the strength of a trend in the market. It was developed by J. Welles Wilder and is used in technical analysis to identify whether a market is trending or not. The ADX is part of the larger family of Directional Movement Indicators (DMI), which includes the Positive Directional Indicator (+DI) and Negative Directional Indicator (-DI).`,`The ADX is calculated by taking the difference between the +DI and -DI, and then dividing it by the sum of the +DI and -DI over a specified period of time. The result is then multiplied by 100 to give a value between 0 and 100.`, 'A reading of 0 indicates that there is no trend in the market, while a reading of 100 indicates that the market is trending strongly.']
    },
    {
      value: "RSI",
      label: 'Relative Strength Index (RSI)',
      param:{
        timePeriod: 14
      },
      toolTip:['Relative Strength Index (RSI) is a technical analysis indicator that measures the strength of price action by comparing the magnitude of recent gains to recent losses in an attempt to determine overbought and oversold conditions of an asset. It is a momentum oscillator that ranges between 0 and 100, with levels above 70 indicating an overbought condition, and levels below 30 indicating an oversold condition.','RSI = 100 - [100 / (1 + RS)]', `RS is the average of the gains divided by the average of the losses over a specified time period.`,`The default time period used is 14 days`, `The result of the Relative Strength Index (RSI) is a numerical value that indicates the strength of price action of an asset. The RSI value ranges between 0 and 100, with values above 70 considered overbought and values below 30 considered oversold.`]

    },
    {
      value: "SO",
      label: 'Stochastic Oscillator',
      param:{
        timePeriod: 14
      },
      toolTip:[`The Stochastic Oscillator is a technical analysis tool that measures the relationship between an asset's closing price and its price range over a specific period of time. It helps traders identify potential trend reversals, overbought or oversold conditions, and possible entry or exit points for trades.`,`The Stochastic Oscillator consists of two lines: the %K line and the %D line. The %K line represents the current price relative to the range of prices over a specified time period, typically 14 days. The %D line is a moving average of the %K line, typically calculated over a period of 3 days.`,`The Stochastic Oscillator ranges from 0 to 100, with values above 80 generally considered overbought and values below 20 considered oversold. When the %K line crosses above the %D line, it is considered a bullish signal, while a bearish signal is generated when the %K line crosses below the %D line.`]
    },
    {
      value: "MACD",
      label: 'Moving Average Convergence Divergence (MACD)',
      toolTip:[`MACD (Moving Average Convergence Divergence) is a popular technical indicator used in trading and investing. It is used to identify changes in momentum, strength, and direction of a financial asset's price movement.`,`MACD is calculated by subtracting the 26-day exponential moving average (EMA) from the 12-day EMA. A signal line, which is a 9-day EMA of the MACD line, is then plotted on top of the MACD line to indicate potential buy or sell signals.`,`When the MACD line crosses above the signal line, it is considered a bullish signal and suggests that the price of the asset may be trending higher. On the other hand, when the MACD line crosses below the signal line, it is considered a bearish signal and suggests that the price of the asset may be trending lower.`]
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
  const [openSell, setOpenSell] = useState(false)
  const [openRisk, setOpenRisk] = useState(false)
  const [buyRules, setBuyRules] = useState(
    [{
      type: "And",
      value: 0,
      rules: [{
        expression1:{type: "Close Price", param:{}},
        operator:">",
        expression2: {type: "Number", param:{value:1}}
      }]
    }]
  );
  const [sellRules, setSellRules] = useState(
    [{
      type: "And",
      value: 0,
      rules: [{
        expression1:{type: "Close Price", param:{}},
        operator:">",
        expression2: {type: "Number", param:{value:1}}
      }]
    }]
  )
  const [ex1, setEx1] = useState([[expression.filter(item => item.value != "Number" )]])
  const [ex2, setEx2] = useState([[expression.filter(item => item.value != "Close Price")]])
  const [sellEx1 ,setSellEx1] = useState([[expression.filter(item => item.value != "Number" )]])
  const [sellEx2, setSellEx2] = useState([[expression.filter(item => item.value != "Close Price")]])

  useEffect(()=>{

    if (userData.ex1 && userData.ex2 && userData.sellEx1 && userData.sellEx2 && userData.buyCondition && userData.sellCondition) {
      setEx1(userData.ex1)
      setEx2(userData.ex2)
      setSellEx1(userData.sellEx1)
      setSellEx2(userData.sellEx2)
      setBuyRules(userData.buyCondition)
      setSellRules(userData.sellCondition)
    }
  },[])

  useEffect(()=>{
    setUserData({
      ...userData,
      buyCondition:buyRules,
      sellCondition:sellRules,
      ex1,
      ex2,
      sellEx1,
      sellEx2
    })
  },[buyRules, sellRules, ex1, ex2, sellEx1, sellEx2])


  const checkTypeFor100 = (value) =>{
    return (value == 'RSI' || value == 'SO' || value == 'ADX')
  }

  const hasMoreThanTwoDC = (num) =>{
    const parts = num.toString().split('.');
    if (parts.length < 2) return false;
    return parts[1].length > 2;
  }

  // Add Group
  const handleAddGroup = (obj, setObj, ex1Obj, ex2Obj, setEx1Obj, setEx2Obj) =>{
    try{
      const tempGroup = [...obj, initGroup]
      const tempEx1 = [...ex1Obj, [expression.filter(item => item.value != "Number" )]]
      const tempEx2 = [...ex2Obj, [expression.filter(item => item.value != "Close Price")]]
      setObj(tempGroup)
      setEx1Obj(tempEx1)
      setEx2Obj(tempEx2)
    }catch(err){
      console.log(err)
    }
  }

  // Remove Group
  const handleRemoveGroup =(groupIndex, obj, setObj, ex1Obj, ex2Obj, setEx1Obj, setEx2Obj) =>{
    try{
      const tempGroup = [...obj]
      const tempEx1 = [...ex1Obj]
      const tempEx2 = [...ex2Obj]

      tempGroup.splice(groupIndex, 1)
      tempEx1.splice(groupIndex, 1)
      tempEx2.splice(groupIndex, 1)

      setObj(tempGroup)
      setEx1Obj(tempEx1)
      setEx2Obj(tempEx2)
    }catch(err){
      console.log(err)
    }
  }

  // Change Group Rules
  const handleGroupRule = (value, groupIndex, obj, setObj)=>{
    try{
      const tempGroup = [...obj]
      tempGroup[groupIndex].type = value
      if (value == 'Count'){tempGroup[groupIndex].value = 1}
      setObj(tempGroup)
    }catch(err){
      console.log(err)
    }
  }

  // Change Group Count Value
  const handleCountValueChange = (groupIndex, value, obj, setObj)=>{
    try{
      const tempGroup = [...obj]
      tempGroup[groupIndex].value = value
      setObj(tempGroup)
    }catch(err){
      console.log(err)
    }
  }

  // add rules
  const handleAddRules = (groupIndex, obj, setObj, ex1Obj, ex2Obj, setEx1Obj, setEx2Obj) =>{
    try{
      const tempGroup = [...obj]
      tempGroup[groupIndex].rules.push(initRules)
      const tempEx1 = [...ex1Obj]
      const tempEx2 = [...ex2Obj]

      tempEx1[groupIndex].push(expression.filter(item => item.value != "Number" ))
      tempEx2[groupIndex].push(expression.filter(item => item.value != "Close Price" ))

      setObj(tempGroup)
      setEx1Obj(tempEx1)
      setEx2Obj(tempEx2)
    }catch(err){
      console.log(err)
    }
  }

  // remove rules
  const handleRemoveRules = (groupIndex, ruleIndex, obj, setObj, ex1Obj, ex2Obj, setEx1Obj, setEx2Obj) =>{
    try{
      const tempGroup = [...obj]
      const tempEx1 = [...ex1Obj]
      const tempEx2 = [...ex2Obj]

      tempGroup[groupIndex].rules.splice(ruleIndex,1)
      tempEx1[groupIndex].splice(ruleIndex,1)
      tempEx2[groupIndex].splice(ruleIndex,1)

      setObj(tempGroup)
      setEx1Obj(tempEx1)
      setEx2Obj(tempEx2)

    }catch(err){
      console.log(err)
    }
  }

  const exFilter = (value) =>{
    try{
      if(checkTypeFor100(value)){
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
  const handleExpressionOneChange = (value, groupIndex, ruleIndex, obj, setObj, ex2Obj, setEx2Obj) =>{
    try{
      // console.log("group"+groupIndex+'rule'+ruleIndex)
      let tempGroup = [...obj]
      let tempEx2 = [...ex2Obj]
      let newEx2 = exFilter(value);
      let exObj = expression.filter(item => item.value == value)

      tempEx2[groupIndex][ruleIndex] = newEx2
      tempGroup[groupIndex].rules[ruleIndex].expression1 = {
        type: value,
        param: exObj[0].param
      }

      if(checkTypeFor100(value)){
        tempGroup[groupIndex].rules[ruleIndex].expression2 = {type: "Number", param: {value: 1}}
      } 

      setObj(tempGroup)
      setEx2Obj(tempEx2)
    }catch(err){
      console.log(err)
    }
  }

  //exp2
  const handleExpressionTwoChange = (value, groupIndex, ruleIndex, obj, setObj, ex1Obj, setEx1Obj)=>{
    try{
      let tempGroup = [...obj]
      let tempEx1 = [...ex1Obj]
      let newEx1 = exFilter(value);
      let exObj = expression.filter(item => item.value == value)

      tempEx1[groupIndex][ruleIndex] = newEx1
      tempGroup[groupIndex].rules[ruleIndex].expression2 = {
        type: value,
        param: exObj[0].param
      }

      if(checkTypeFor100(value)){
        tempGroup[groupIndex].rules[ruleIndex].expression1 = {type: "Number", param: {value: 1}}
      } 

      setObj(tempGroup)
      setEx1Obj(tempEx1)
    }catch(err){
      console.log(err)
    }
  }

  //operator
  const handleOperatorChange = (value, groupIndex, ruleIndex, obj, setObj)=>{
    try{
      let tempGroup = [...obj]
      tempGroup[groupIndex].rules[ruleIndex].operator = value
      setObj(tempGroup)
    }catch(err){
      console.log(err)
    }
  }

  //renderExpParam
  const renderExpParam = (value, groupIndex, rulesIndex, position,  obj, setObj) =>{
    try{
      //param change
      const handleParamChange = (value, key) =>{
        try{
          let tempGroup = [...obj]
          if(position == 1){
            tempGroup[groupIndex].rules[rulesIndex].expression1.param[key] = value
          }else if(position == 2){
            tempGroup[groupIndex].rules[rulesIndex].expression2.param[key] = value
          }
          setObj(tempGroup)
        }catch(err){
          console.log(err)
        }
      }

      //max and width
      let max = 9999999
      let width = 150

      if(position == 1){
        max = obj[groupIndex].rules[rulesIndex].expression2.type == "Volume" ? 9999999999 : 999999
        let tempType = obj[groupIndex].rules[rulesIndex].expression2.type
        if(checkTypeFor100(tempType)){
          max = 100
        }
      }else if(position == 2){
        let tempType = obj[groupIndex].rules[rulesIndex].expression1.type
        max = obj[groupIndex].rules[rulesIndex].expression1.type == "Volume" ? 9999999999 : 999999
        if(checkTypeFor100(tempType)){
          max = 100
        }
      }

      if(value.param != undefined){
        const keys = Object.keys(value.param)
        return(
          <div key={value.type+groupIndex+"_"+rulesIndex} className=' self-center'>
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
                      let value = e.target.value
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

  // get toolTip desc
  const getDesc = (value) =>{
    try{
      let desc = expression.filter(item => item.value == value)
      return (
        <>
          {desc[0].toolTip.map((item, i)=>(
            <div key={i}>
              <br/>{item}
            </div>
          ))}
        </>
      )


    }catch(err){
      console.log(err)
    }
  }

  //stop loss
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

  //stop earn
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

  const handleInvestmentChange = (value) =>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= 999999) value = 999999
        if(value <= 1000) value = 1000
        if(hasMoreThanTwoDC(value)) value = value.toFixed(2)
        setUserData({
          ...userData,
          investment: value
        })
      }else{
        console.log("Not a number!")
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
                <div className='flex flex-wrap justify-start '>
                  <div className='flex'>
                      <TextField
                              label="Investment USD"
                              id="outlined-start-adornment"
                              sx={{ m: 1, width: '25ch' }}
                              style={{margin:0, marginBottom:'1rem', marginRight:'1rem'}}
                              type="number"
                              InputProps={{
                                inputProps: { min: 1000, max: 999999 }
                              }}
                              value={userData.investment ?  userData.investment : 1000}
                              onChange={(e)=>handleInvestmentChange(e.target.value)}
                              onBlur={(e)=>{
                                if(e.target.value > 999999){
                                  handleInvestmentChange(999999)
                                }
                              }}
                      />
                  </div>
                </div>
                {/* group */}
                {buyRules.map((group, i)=>(
                    <div className=' border py-5 border-slate-600 rounded-lg p-5 mb-5' key={"Group_"+i}>
                        <div className='flex flex-wrap mb-5'>
                          <div className='self-center '>
                              <span className='text-lg ml-5 font-bold'>Group #{i} &nbsp;&nbsp;&nbsp;</span>
                          </div>

                            {/* group remove button */}

                            {i == 0 ? <></> : 
                            <div>
                              <button className="bg-red-300 text-red-700 font-bold py-2 px-4 rounded inline-flex items-center my-3"
                                      onClick={()=>handleRemoveGroup(i, buyRules, setBuyRules, ex1, ex2, setEx1, setEx2)}>
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
                                onChange={(event)=>handleGroupRule(event.target.value, i, buyRules, setBuyRules)
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
                                    handleCountValueChange(i, 100, buyRules, setBuyRules)
                                  }else{
                                    handleCountValueChange(i, e.target.value, buyRules, setBuyRules)
                                  }
                                  
                                }}
                                onBlur={(e)=>{
                                  let value = Math.round(e.target.value)
                                  value <= 0 ? handleCountValueChange(i, 1, buyRules, setBuyRules) : handleCountValueChange(i, value, buyRules, setBuyRules)
                                }}
                            />
                          :<></>}
                          <Tooltip title={
                            <div>Group Operator
                              <br/>
                              <br/>And: All rules should pass in order to execute the Buy Option
                              <br/>
                              <br/>Not: All rules should fail in order to execute the Buy Option
                              <br/>
                              <br/>Count: At least the number of rules in the group should be pass in order to execute the Buy Option
                          </div>} placement="right">
                            <IconButton>
                              <HelpIcon/>
                            </IconButton>
                          </Tooltip>
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
                              {rules.expression2.type == "MACD" ? <></> : 
                                <div className='self-center'>                    
                                  <TextField
                                          select
                                          label="Expression 1"
                                          style={rules.expression1.type== "MACD" ? {width:420} : {width:180}}
                                          defaultValue= {"Close Price"}
                                            onChange={(event)=>handleExpressionOneChange(event.target.value, i, j, buyRules, setBuyRules, ex2, setEx2)
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
                              }
                              {rules.expression2.type == "MACD" ? <></> : 
                                <Tooltip title={
                                  <div>Rule Explanation
                                    <br/>
                                    {getDesc(buyRules[i].rules[j].expression1.type)}
                                  </div>} placement="right">
                                  <IconButton>
                                    <HelpIcon/>
                                  </IconButton>
                                </Tooltip>
                              }
                              {rules.expression2.type == "MACD" ? <></>:
                                renderExpParam(rules.expression1, i, j, 1, buyRules, setBuyRules)
                              }
                              {/* operator */}
                              {rules.expression2.type == "MACD" || rules.expression1.type == "MACD" ? <></> :
                                <div className=' self-center'>
                                    <TextField
                                          select
                                          label="Operator"
                                          style={{width:80}}
                                          defaultValue= {">"}
                                            onChange={(event)=>handleOperatorChange(event.target.value, i, j, buyRules, setBuyRules)
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
                              }

                              {/* expression 2 */}
                              {rules.expression1.type == "MACD" ? <></>:
                                  <div className=' self-center'>
                                    <TextField
                                          select
                                          style={rules.expression2.type== "MACD" ? {width:420} : {width:180}}
                                          label="Expression 2"
                                          defaultValue= {rules.expression2.type}
                                            onChange={(event)=>handleExpressionTwoChange(event.target.value, i, j, buyRules, setBuyRules, ex1, setEx1)
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
                              }

                              {rules.expression1.type== "MACD" ? <></>:
                                <Tooltip title={
                                  <div>Rule Explanation
                                    <br/>
                                    <br />{getDesc(buyRules[i].rules[j].expression2.type)}
                                    <br/>
                                  </div>} placement="right">
                                  <IconButton>
                                    <HelpIcon/>
                                  </IconButton>
                                </Tooltip>
                              }

                              {rules.expression1.type == "MACD" ? <></> : 
                                renderExpParam(rules.expression2, i, j, 2, buyRules, setBuyRules)
                              }

                              {/* remove rule */}
                              {j == 0 ? <></>: 
                              
                                <button className="bg-red-300 text-red-700 font-bold py-2 px-4 rounded inline-flex items-center my-3"
                                        onClick={()=>handleRemoveRules(i,j, buyRules, setBuyRules, ex1, ex2, setEx1, setEx2)}>
                                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M14.348 14.849L10.196 10.697L14.348 6.546C14.742 6.151 14.742 5.516 14.348 5.121C13.954 4.727 13.319 4.727 12.924 5.121L8.772 9.273L4.621 5.121C4.226 4.727 3.591 4.727 3.197 5.121C2.803 5.516 2.803 6.151 3.197 6.546L7.348 10.697L3.197 14.849C2.803 15.243 2.803 15.878 3.197 16.273C3.389 16.465 3.627 16.562 3.864 16.562C4.101 16.562 4.339 16.465 4.531 16.273L8.682 12.121L12.834 16.273C13.026 16.465 13.264 16.562 13.501 16.562C13.738 16.562 13.976 16.465 14.168 16.273C14.562 15.878 14.562 15.243 14.168 14.849Z" />
                                    </svg>
                                    <span className="mr-2">Rule #{j}</span>
                                </button>
                              }
                            </div>

                            <div className='py-5'>
                              <hr className=''/>
                            </div>
                          </div>

                        ))}
                        {/* add rule */}
                        <div className='flex flex-wrap justify-start mt-3 mx-4'>
                          <Button onClick={()=>handleAddRules(i, buyRules, setBuyRules, ex1, ex2, setEx1, setEx2)}>Add Rules</Button>
                        </div>

                    </div>
                ))}
                <div className='flex flex-wrap justify-center'>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={()=>handleAddGroup(buyRules, setBuyRules, ex1, ex2, setEx1, setEx2)}>
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

          {/* Sell rules button */}
          <div className='mb-5'>
              <button className="bg-red-300 text-red-700 font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={()=>setOpenSell(!openSell)}>
                  <span className="mr-2">Sell Rules</span>
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6L14 10L6 14V6Z" />
                  </svg>
              </button> 
          </div>

          <div>
            <Collapse in={openSell} timeout="auto" unmountOnExit>
                {/* group */}
                {sellRules.map((group, i)=>(
                    <div className=' border py-5 border-slate-600 rounded-lg p-5 mb-5' key={"Sell_Group_"+i}>
                        <div className='flex flex-wrap mb-5'>
                          <div className='self-center '>
                              <span className='text-lg ml-5 font-bold'>Group #{i} &nbsp;&nbsp;&nbsp;</span>
                          </div>

                            {/* group remove button */}

                            {i == 0 ? <></> : 
                            <div>
                              <button className="bg-red-300 text-red-700 font-bold py-2 px-4 rounded inline-flex items-center my-3"
                                      onClick={()=>handleRemoveGroup(i, sellRules,setSellRules,sellEx1,sellEx2,setSellEx1,setSellEx2)}>
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
                                onChange={(event)=>handleGroupRule(event.target.value, i, sellRules, setSellRules)
                              }
                              value={group.type}
                              >
                              {groupType.map((option) => (
                                  <MenuItem key={option.value+"SELL"} value={option.value}>
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
                                    handleCountValueChange(i, 100, sellRules, setSellRules)
                                  }else{
                                    handleCountValueChange(i, e.target.value, sellRules, setSellRules)
                                  }
                                  
                                }}
                                onBlur={(e)=>{
                                  let value = Math.round(e.target.value)
                                  value <= 0 ? handleCountValueChange(i, 1, sellRules, setSellRules) : handleCountValueChange(i, value, sellRules, setSellRules)
                                }}
                            />
                          :<></>}
                          <Tooltip title={
                            <div>Group Operator
                              <br/>
                              <br/>And: All rules should pass in order to execute the Sell Option
                              <br/>
                              <br/>Not: All rules should fail in order to execute the Sell Option
                              <br/>
                              <br/>Count: At least the number of rules in the group should be pass in order to execute the Sell Option
                          </div>} placement="right">
                            <IconButton>
                              <HelpIcon/>
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className='py-5'>
                          <hr className=''/>
                        </div>


                        {/* rules */}
                        {group.rules.map((rules, j) =>(
                          <div key={"Sell_Group_"+i+"_Rule"+j}>
                            <div className='flex flex-wrap'>
                              <div className=' justify-center self-center'>
                                  <span className='text-lg ml-5 font-bold'>Rules #{j}</span>
                              </div>
                              {/* expression 1 */}
                              {rules.expression2.type == "MACD" ? <></> : 
                                <div className='self-center'>                    
                                  <TextField
                                          select
                                          label="Expression 1"
                                          style={rules.expression1.type== "MACD" ? {width:420} : {width:180}}
                                          defaultValue= {"Close Price"}
                                            onChange={(event)=>handleExpressionOneChange(event.target.value, i, j, sellRules,setSellRules,sellEx2,setSellEx2)
                                          }
                                          value={rules.expression1.type}
                                          >
                                          {sellEx1[i][j].map((option) => (
                                              <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                              </MenuItem>
                                          ))}
                                    </TextField>
                                </div>
                              }
                              {rules.expression2.type == "MACD" ? <></> : 
                                <Tooltip title={
                                  <div>Rule Explanation
                                    <br/>
                                    <br />{getDesc(sellRules[i].rules[j].expression1.type)}
                                    <br/>
                                  </div>} placement="right">
                                  <IconButton>
                                    <HelpIcon/>
                                  </IconButton>
                                </Tooltip>
                              }
                              {rules.expression2.type == "MACD" ? <></>:
                                renderExpParam(rules.expression1, i, j, 1, sellRules,setSellRules)
                              }
                              {/* operator */}
                              {rules.expression2.type == "MACD" || rules.expression1.type == "MACD" ? <></> :
                                <div className=' self-center'>
                                    <TextField
                                          select
                                          label="Operator"
                                          style={{width:80}}
                                          defaultValue= {">"}
                                            onChange={(event)=>handleOperatorChange(event.target.value, i, j, sellRules,setSellRules)
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
                              }

                              {/* expression 2 */}
                              {rules.expression1.type == "MACD" ? <></>:
                                  <div className=' self-center'>
                                    <TextField
                                          select
                                          style={rules.expression2.type== "MACD" ? {width:420} : {width:180}}
                                          label="Expression 2"
                                          defaultValue= {rules.expression2.type}
                                            onChange={(event)=>handleExpressionTwoChange(event.target.value, i, j, sellRules,setSellRules,sellEx1,setSellEx1)
                                          }
                                          value={rules.expression2.type}
                                          >
                                          {sellEx2[i][j].map((option)=>(
                                              <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                              </MenuItem>
                                          ))}
                                    </TextField>
                                </div>
                              }

                              {rules.expression1.type== "MACD" ? <></>:
                                <Tooltip title={
                                  <div>Group Operator
                                    <br/>
                                    <br />{getDesc(sellRules[i].rules[j].expression2.type)}
                                    <br/>
                                  </div>} placement="right">
                                  <IconButton>
                                    <HelpIcon/>
                                  </IconButton>
                                </Tooltip>
                              }

                              {rules.expression1.type == "MACD" ? <></> : 
                                renderExpParam(rules.expression2, i, j, 2,sellRules,setSellRules)
                              }

                              {/* remove rule */}
                              {j == 0 ? <></>: 
                              
                                <button className="bg-red-300 text-red-700 font-bold py-2 px-4 rounded inline-flex items-center my-3"
                                        onClick={()=>handleRemoveRules(i,j, sellRules,setSellRules,sellEx1,sellEx2,setSellEx1,setSellEx2)}>
                                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M14.348 14.849L10.196 10.697L14.348 6.546C14.742 6.151 14.742 5.516 14.348 5.121C13.954 4.727 13.319 4.727 12.924 5.121L8.772 9.273L4.621 5.121C4.226 4.727 3.591 4.727 3.197 5.121C2.803 5.516 2.803 6.151 3.197 6.546L7.348 10.697L3.197 14.849C2.803 15.243 2.803 15.878 3.197 16.273C3.389 16.465 3.627 16.562 3.864 16.562C4.101 16.562 4.339 16.465 4.531 16.273L8.682 12.121L12.834 16.273C13.026 16.465 13.264 16.562 13.501 16.562C13.738 16.562 13.976 16.465 14.168 16.273C14.562 15.878 14.562 15.243 14.168 14.849Z" />
                                    </svg>
                                    <span className="mr-2">Rule #{j}</span>
                                </button>
                              }
                            </div>

                            <div className='py-5'>
                              <hr className=''/>
                            </div>
                          </div>

                        ))}
                        {/* add rule */}
                        <div className='flex flex-wrap justify-start mt-3 mx-4'>
                          <Button onClick={()=>handleAddRules(i, sellRules,setSellRules,sellEx1,sellEx2,setSellEx1,setSellEx2)}>Add Rules</Button>
                        </div>

                    </div>
                ))}
                <div className='flex flex-wrap justify-center'>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={()=>handleAddGroup(sellRules,setSellRules,sellEx1,sellEx2,setSellEx1,setSellEx2)}>
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8V7a1 1 0 012 0v3h3a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3H6a1 1 0 010-2h3z"/>
                    </svg>
                    Add Sell Condition Group
                  </button>
                </div>

            </Collapse>
         </div>

         <div className='my-5'>
            <hr/>
         </div>

          {/* Risk Management button */}
          <div className='mb-5'>
              <button className="bg-blue-300 text-blue-700 font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={()=>setOpenRisk(!openRisk)}>
                  <span className="mr-2">Risk Management</span>
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6L14 10L6 14V6Z" />
                  </svg>
              </button>  
          </div>

          <div>
            <Collapse in={openRisk} timeout="auto" unmountOnExit>
              <div className=' border py-5 border-slate-600 rounded-lg p-5 mb-5'>
                  <div className='flex flex-wrap mb-5'>
                    <div className='self-center '>
                        <span className='text-lg ml-5 font-bold'>Risk Management Parameters</span>
                    </div>
                  </div>
                  {/* stop loss */}
                  <div className='flex flex-wrap justify-start '>
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
                  </div>
                  {/* stop earning */}
                  <div className='flex flex-wrap justify-start '>
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
                      <Tooltip title={"e.g. Investment: $100, \nbuy price: $100, Stop Earning %: 10%, when the value of your holding is $110, Your assets will be sold. (0 will never stop)"} placement="right">
                      <IconButton>
                        <HelpIcon/>
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Collapse>
         </div>
  </Box>
  )
}

export default CusRules