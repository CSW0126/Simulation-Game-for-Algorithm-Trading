import React ,{useContext}from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { StepperContext } from '../../../../contexts/StepperContext';

const StockForm = () => {
  const {userData, setUserData} = useContext(StepperContext)
  const currencies = [
    {
      value: 'AAPL',
      label: 'AAPL (Apple)',
    },
    {
      value: 'AMZN',
      label: 'AMZN (Amazon)',
    },
    {
      value: 'TSLA',
      label: 'TSLA (Tesla)',
    },
    {
      value: 'MSFT',
      label: 'MSFT (Microsoft)',
    },
    {
      value: 'GOOGL',
      label: 'GOOGL (Google)',
    },
    {
      value: 'NVDA',
      label: 'NVDA (NVIDIA Corp.)',
    },
  ];

  const handlePairChange = (value)=>{
    console.log(value)
    setUserData({
        ...userData,
        pair:value
    })
  }

  return (
    <div className='grid justify-center'>
      <div className='mt-10 animate__animated animate__fadeInUp'>
          <Box
          // component="form"
          sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
          >
          <div>
              <TextField
                  id="outlined-select-currency"
                  select
                  label="Select"
                  defaultValue= "AAPL"
                  helperText="Please select your trading pair"
                  onChange={(event)=>handlePairChange(event.target.value)
                  }
                  value={userData.pair}
                  >
                  {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                      {option.label}
                      </MenuItem>
                  ))}
              </TextField>
              
          </div>
          </Box>
      </div> 
    </div>
  )
}

export default StockForm