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


const DCARules = () => {
  const {userData, setUserData, historicalData} = useContext(StepperContext)

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
        </div>
      </Box>
  )
}

export default DCARules