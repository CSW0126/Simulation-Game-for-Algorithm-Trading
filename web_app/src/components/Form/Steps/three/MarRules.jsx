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

const MarRules = () => {
  const {userData, setUserData, historicalData} = useContext(StepperContext)
  const maxShare = 16383
  const singleShareMax = 2 ** 13
  const maxTakeProfit = 100
  const maxStopEarn = 100000
  const maxUp = 999999
  const [calData , setCalData] = useState({
    t_drawback: 1,
    t_shares: 3
  })
  const [minInvest, setMinInvest] = useState(1)
  const [userMoney, setUserMoney] = useState((userData.type == 1 || userData == 2) ?  9999999 : (JSON.parse(Cookies.get('_auth_state'))).user.money)

  const [priceScaleData, setPriceScaleData] = useState([])

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
    const autoInputPriceScaleDataIfAny = () =>{
      try{
        if (userData.priceScaleData){
          setPriceScaleData(userData.priceScaleData)
        }else{
          console.log('no priceScaleData')
        }
      }catch(err){
        console.log(err)
      }
    }
    const initMinInvestValue = () =>{
      try{
        if (userData.type == 1){
          setMinInvest(100)
        }else if (userData.type == 2){
          //3x current close price
          let price = 3 * historicalData.data[historicalData.data.length-1].close
          price = Math.ceil(price)
          setMinInvest(price)
        }
      }catch(err){
        console.log(err)
      }
    }

    autoInputPriceScaleDataIfAny()
    initMinInvestValue()
  },[])


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

    if(userData.type == 2){
      setMinInvest(Math.ceil(totalS * historicalData.data[historicalData.data.length-1].close))
    }

    setUserData({...userData,priceScaleData:priceScaleData})
  },[priceScaleData])

  useEffect(() =>{
    setUserData({
      ...userData,
      investment: minInvest
    })
  }, [minInvest])

  useEffect(()=>{
    console.log(rangeDate)
    if(rangeDate.length == 2){
      setUserData({
        ...userData,
        rangeDate : rangeDate
      })
    }
  },[rangeDate])



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
        if(value <= minInvest) value = minInvest
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

  const handleUp = (value) =>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= maxUp) value = maxUp
        if(value < 0) value = 0
        if(hasMoreThanTwoDC(value)) value = value.toFixed(5)
        setUserData({
          ...userData,
          price_range_up: value
        })
      }else{
        console.log("Not a number!")
      }
    }catch(err){
      console.log(err)
    }
  }

  const handleBottom = (value) =>{
    try{
      if(!isNaN(value)){
        value = Number(value)
        if(value >= maxUp) value = maxUp
        if(value < 0) value = 0
        if(hasMoreThanTwoDC(value)) value = value.toFixed(5)
        setUserData({
          ...userData,
          price_range_bot: value
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
        className='animate__animated animate__fadeIn '
      >
        <div className=' border py-5 border-slate-600 rounded-lg p-5'>
          <span className=' text-lg ml-5 mb-3'>Setup the rules</span>
          <Tooltip title={
            <div>Drawback %: Executed Buy order when the price go down with this %.
              <br/>
              <br />Share(s): Your investment will be divided in to the Sum of all shares, and only the shares in that row will be use to execute the buy order.
              <br/>
              <br/>Example: 
              <br/>&nbsp;&nbsp;#0 (drawback: 0, shares:1)
              <br/>&nbsp;&nbsp;#1 (drawback: 1, shares:2)
              <br/>&nbsp;&nbsp;Total shares: 3
              <br/>&nbsp;&nbsp;Investment: $100
              <br/>&nbsp;&nbsp;Current Price: $100
              <br/>When execute the buy order of #0, it will buy in current price (i.e. 0 drawback), using $33.3. (i.e. 1/3 * Investment)
              <br/>
              <br/>When price go down to $99, it will execute the #1 buy order (i.e. 1% drawback), using $66.6 (i.e. 2/3 * Investment)

            </div>} placement="right">
              <IconButton>
                <HelpIcon/>
              </IconButton>
            </Tooltip>
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
                      inputProps: { min: minInvest, max: userMoney }
                    }}
                    value={userData.investment ?  userData.investment : minInvest}
                    onChange={(e)=>handleInvestmentChange(e.target.value)}
                    onBlur={(e)=>{
                      if(e.target.value > userMoney){
                        handleInvestmentChange(userMoney)
                      }
                    }}
            />
          </div>
          <div className='flex'>
              {/* <span className=' flex text-sm text-gray-900 my-auto'>P.S. You have total: ${userMoney}</span> */}
              <span className=' flex text-sm text-gray-900 my-auto'>Your Investment.</span>
          </div>
        </div>
        {/* take profit */}
        <div className='flex flex-wrap justify-start '>
          <div className='flex'>
            <TextField
                    label="Take profit ratio (>=0.1%)"
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: '25ch' }}
                    type="number"
                    InputProps={{
                      inputProps: { min: 0.1, max: maxTakeProfit }
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
              <Tooltip title={"e.g. Investment: $100, \nbuy price: $100, Stop Earning %: 10%, when the value of your holding is $110, Your assets will be sold and game end. (0 will never stop)"} placement="right">
              <IconButton>
                <HelpIcon/>
              </IconButton>
            </Tooltip>
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
        {/* price range up */}
        <div className='flex flex-wrap justify-start '>
          <div className='flex'>
            <TextField
                    label="Upper price"
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: '25ch' }}
                    type="number"
                    InputProps={{
                      inputProps: { min: 0, max: maxUp }
                    }}
                    value={userData.price_range_up}
                    onChange={(e)=>handleUp(e.target.value)}
                    onBlur={(e)=>{
                      if(e.target.value <= userData.price_range_bot){
                        handleUp(0)
                      }
                    }}
            />
          </div>
          <div className='flex'>
              <span className=' flex text-sm text-gray-900 my-auto'>Pause the algorithm when the price &nbsp;<span className=' font-bold'>Pass</span>&nbsp; this value.</span>            
              <Tooltip title={"e.g. Upper value: 100, when current price >= 100, no buy action will be executed (0: ignore option)"} placement="right">
              <IconButton>
                <HelpIcon/>
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {/* price range bottom */}
        <div className='flex flex-wrap justify-start '>
          <div className='flex'>
            <TextField
                    label="Lower price"
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: '25ch' }}
                    type="number"
                    InputProps={{
                      inputProps: { min: 0, max: maxUp }
                    }}
                    value={userData.price_range_bot}
                    onChange={(e)=>handleBottom(e.target.value)}
                    onBlur={(e)=>{
                      if(e.target.value >= userData.price_range_up){
                        handleBottom(0)
                      }
                    }}
            />
          </div>
          <div className='flex'>
              <span className=' flex text-sm text-gray-900 my-auto'>Pause the algorithm when price &nbsp;<span className=' font-bold'>Below</span>&nbsp; this value.</span>            
              <Tooltip title={"e.g. Lower value: 20, when current price <= 20, no buy action will be executed (0: ignore option)"} placement="right">
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