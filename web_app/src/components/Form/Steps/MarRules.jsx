import React, {useContext, useEffect, useState} from 'react'
import { StepperContext } from '../../../contexts/StepperContext'
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

const MarRules = () => {
  const {userData, setUserData} = useContext(StepperContext)
  const maxShare = 16383
  const singleShareMax = 2 ** 13
  const maxTakeProfit = 100
  const [calData , setCalData] = useState({
    t_drawback: 1,
    t_shares: 3
  })
  const [userMoney, setUserMoney] = useState((JSON.parse(Cookies.get('_auth_state'))).user.money)
  const [priceScaleData, setPriceScaleData] = useState([
    {
      index: 0,
      priceScale: 0,
      share : 1
    },
    {
      index: 1,
      priceScale: 1,
      share : 2
    },
  ])

  useEffect(()=>{
    console.log(priceScaleData)
    let totalD = 1
    let totalS = 0
    for(let item of priceScaleData){
      if(item.priceScale > 0){
        totalD *= ((100 - item.priceScale)/100)
      }
      totalS += item.share
    }

    totalD = (1- totalD) * 100
    totalD = totalD.toFixed(2)
    setCalData({
      ...calData,
      t_drawback:totalD,
      t_shares: totalS
    })
  },[priceScaleData])

  const hasMoreThanTwoDC = (num) =>{
    const parts = num.toString().split('.');
    if (parts.length < 2) return false;
    return parts[1].length > 2;
  }

  const checkSharesLimit = (addedValue) =>{
    let tempTotal = 0
    for(let item of priceScaleData){
      tempTotal += item.share
    }
    tempTotal += addedValue
    if (tempTotal > maxShare){
      return false
    }else{
      return true
    }
  }

  const handleAdd =()=>{
    let nweIndex = priceScaleData.length
    let lastPriceScale = priceScaleData[priceScaleData.length-1].priceScale
    let lastShare = priceScaleData[priceScaleData.length-1].share
    let newShare = Math.round(lastShare * 2)
    if (newShare > singleShareMax) newShare = singleShareMax
    if (checkSharesLimit(newShare)){
      setPriceScaleData(priceScaleData => [...priceScaleData, {index: nweIndex,priceScale:lastPriceScale,share:newShare}])
    }else{
      alert("Total Shares cannot be more than "+maxShare)
    }
    
  }

  const handleDelete = ()=>{
    let arrayItem = [...priceScaleData]
    if(arrayItem.length > 2){
      arrayItem.pop()
      setPriceScaleData(arrayItem)
    }
  }

  const handleDrawBackChange = (index, value) =>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= 100) value = 100
        if(hasMoreThanTwoDC(value)) value = value.toFixed(2)
        let arrayItem = [...priceScaleData]
        arrayItem[index].priceScale = value
        setPriceScaleData(arrayItem)
      }else{
        console.log("Not a number!")
      }
    }catch (err){
      console.log(err)
    }
  }

  const handleShareChange = (index, value) =>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= singleShareMax) value = singleShareMax
        if(checkSharesLimit(value)){
          let arrayItem = [...priceScaleData]
          arrayItem[index].share = value
          setPriceScaleData(arrayItem)
        }else{
          let total = 0
          for (let i in priceScaleData){
            if(i != index){
              total+= priceScaleData[i].share
            }

          }
          value = maxShare - total
          let arrayItem = [...priceScaleData]
          arrayItem[index].share = value
          setPriceScaleData(arrayItem)
        }

      }else{
        console.log("Not a number!")
      }
    }catch (err){
      console.log(err)
    }
  }

  const handleInvestmentChange = (value) =>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= userMoney) value = userMoney
        if(value <= 0) value = 1
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

  const handleTakeProfitChange = (value)=>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= maxTakeProfit) value = maxTakeProfit
        if(value <= 0.1) value = 0.1
        if(hasMoreThanTwoDC(value)) value = value.toFixed(2)
        setUserData({
          ...userData,
          take_profit: value
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
      >
        <div className=' border py-5 border-slate-600 rounded-lg p-5'>
          <p className=' text-lg ml-5 mb-3'>Setup the rules</p>
          {priceScaleData.map((item) =>(
            <div className='flex justify-center' key={item.index}>
                <p className=' text-gray-700 font-semibold text-center my-auto mr-5'>
                  # {item.index}
                </p>
                <TextField
                  label="Draw back %"
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: '25ch' }}
                  // defaultValue={item.priceScale}
                  InputProps={{
                    endAdornment: <InputAdornment position='start'>%</InputAdornment>,
                    inputProps: { min: 0, max: 100 }
                  }}
                  disabled = {item.index == 0? true: false}
                  type="number"
                  onChange={(e)=>handleDrawBackChange(item.index, e.target.value)}
                  value={item.priceScale}
                  onBlur={(e) =>{
                    if (e.target.value <= 0) handleDrawBackChange(item.index, 1)
                  }}
                  
                />
                <TextField
                    label="Share(s)"
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: '25ch' }}
                    // defaultValue={item.share}
                    type="number"
                    InputProps={{
                      inputProps: { min: 1, max: singleShareMax }
                    }}
                    value={item.share}
                    onChange={(e)=>{
                      if (e.target.value > singleShareMax) {
                        handleShareChange(item.index, singleShareMax)
                      }else{
                        handleShareChange(item.index, e.target.value)
                      }
                     
                    }}
                    onBlur={(e)=>{
                      let value = Math.round(e.target.value)
                      value <= 0 ? handleShareChange(item.index, 1) : handleShareChange(item.index, value) 
                    }}
                  />
              </div>
          ))}
        </div>
        <div className='flex flex-wrap justify-center'>
            <div className='m-auto mt-3'>
               <Button 
                  onClick={() => handleAdd()}
                  startEnhancer={() => <Plus size={24}/>}>
                Add
              </Button>
            </div>
            <div className='m-auto mt-3'>
              <Button 
                onClick={() => handleDelete()} 
                startEnhancer={() => <Delete size={24}/>}>
                Delete
              </Button>
            </div>
        </div>
        <div className='mt-5 ml-2'>
          <p className='text-sm text-gray-900'>Total drawback : {calData.t_drawback}% 
            <Tooltip title={"Total % of drawback from the \"Entry Price\" if all the buy order executed"} placement="right">
              <IconButton>
                <HelpIcon/>
              </IconButton>
            </Tooltip>
          </p>
          <p className='text-sm text-gray-900'>Total shares: {calData.t_shares}
            <Tooltip title={"e.g. Your investment is $100, and 100 shares means that $100 is divided into 100 shares and each share contains $1"} placement="right">
              <IconButton>
                <HelpIcon/>
              </IconButton>
            </Tooltip>
          </p>
        </div>
        <div className='flex flex-wrap justify-start '>
          <div className='flex'>
            <TextField
                    label="Investment"
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: '25ch' }}
                    type="number"
                    InputProps={{
                      inputProps: { min: 1, max: userMoney }
                    }}
                    value={userData.investment ?  userData.investment : 1}
                    onChange={(e)=>handleInvestmentChange(e.target.value)}
                    onBlur={(e)=>{
                      if(e.target.value > userMoney){
                        handleInvestmentChange(userMoney)
                      }
                    }}
            />
          </div>
          <div className='flex'>
              <span className=' flex text-sm text-gray-900 my-auto'>P.S. You have total: ${userMoney}</span>
          </div>
        </div>
        <div className='flex flex-wrap justify-start '>
          <div className='flex'>
            <TextField
                    label="Take profit ratio (>=0.1%)"
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: '25ch' }}
                    type="number"
                    InputProps={{
                      inputProps: { min: 0.1, max: 100 }
                    }}
                    value={userData.take_profit}
                    onChange={(e)=>handleTakeProfitChange(e.target.value)}
                    onBlur={(e)=>{
                      if(e.target.value > maxTakeProfit){
                        handleTakeProfitChange(maxTakeProfit)
                      }
                    }}
            />
          </div>
          <div className='flex'>
              <span className=' flex text-sm text-gray-900 my-auto'>Take profit when earn up to this value.</span>            
              <Tooltip title={"e.g. Investment: $100, \nbuy price: $100, take profit %: 1%, when the price hit $101, Your holdings will be sold to take profit."} placement="right">
              <IconButton>
                <HelpIcon/>
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Box>
  )
}

export default MarRules