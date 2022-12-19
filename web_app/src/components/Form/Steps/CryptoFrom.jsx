import React ,{useContext}from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from "baseui/button";
import { useStateContext } from '../../../contexts/ContextProvider';
import { StepperContext } from '../../../contexts/StepperContext';

const CryptoFrom = ({setPair, handlePreview}) => {
    const {currentColor} = useStateContext();
    const {userData, setUserData} = useContext(StepperContext)
    const currencies = [
        {
          value: 'X:BTCUSD',
          label: 'BTC-USD',
        },
        {
          value: 'X:ETHUSD',
          label: 'ETH-USD',
        },
        {
          value: 'X:MATICUSD',
          label: 'MATIC-USD',
        },
        {
          value: 'X:DOGEUSD',
          label: 'DOGE-USD',
        },
      ];

    const handlePairChange = (value)=>{
        console.log(value)
        setPair(value)
        setUserData({
            ...userData,
            pair:value
        })
    }


    return (
        <div className='mt-10'>
            <Box
            component="form"
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
                    defaultValue="X:BTCUSD"
                    helperText="Please select your trading pair"
                    onChange={(event)=>handlePairChange(event.target.value)}
                    >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                
            </div>
            </Box>
            <div className='mt-5 m-2'>
                <Button onClick={() => handlePreview()}>Preview Chart</Button>
            </div>

        </div>

    );
}

export default CryptoFrom