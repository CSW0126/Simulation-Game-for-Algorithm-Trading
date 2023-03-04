import React, {useContext} from 'react'
import { StepperContext } from '../../../../contexts/StepperContext'
import crypto_img from '../../../../data/eth-btc.png'
import stock_img from '../../../../data/stock-market.jpg'
import random_img  from '../../../../data/Candlestick.png'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useStateContext } from '../../../../contexts/ContextProvider';
import CryptoFrom from './CryptoFrom';
import StockForm from './StockForm';
import RandomForm from './RandomForm'


const PickTrade = () => {
    const {userData, setUserData} = useContext(StepperContext)
    const { currentColor } = useStateContext();

    const handleTypeClick = (selectType) =>{
        if (selectType === 'Crypto'){
            setUserData({
                ...userData,
                saveUser:true,
                type:1,
                pair: "X:BTCUSD",
                investment : 1,
                take_profit: 0.1,
                stop_earn: 0,
                stop_loss: 100,
                price_range_up:0,
                price_range_bot:0,
                period: 1,
                DCAInvestAmount: 1
            })
        }else if(selectType === 'Stock'){
            setUserData({
                ...userData,
                saveUser:true,
                type:2,
                pair: 'AAPL',
                investment : 1,
                take_profit: 0.1,
                stop_earn: 0,
                stop_loss: 100,
                price_range_up:0,
                price_range_bot:0,
                period: 1,
                DCAInvestAmount: 1
            })
        }else if(selectType === 'Random'){
            setUserData({
                ...userData,
                saveUser:true,
                type:3,
            })
        }
    }

    const marketType = (
        <div className='flex place-content-center flex-row flex-wrap'>
            {/* crypto */}
            <div 
                // onClick={()=> handleTypeClick('Crypto')}
                className='flex hover:scale-105 ease-in-out m-auto mt-5 animate__animated animate__fadeIn'>
                <Card sx={{ maxWidth: 300, borderColor:currentColor ,  borderWidth: userData.type === 1 ? '2px':'0px'  }}>
                    <CardActionArea onClick={()=> handleTypeClick('Crypto')}>
                        <CardMedia
                            component="img"
                            image={crypto_img}
                            alt=""
                            sx={{ padding: "1em 1em 0 1em", objectFit: "contain", width:345, height:100 }}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            Crypto Market
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align='left'>
                            &#x2022; The crypto market is a 24/7 market.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align='left'>
                            &#x2022; The price movement are usually large.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align='left'>
                            &#x2022; Very High risk.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
            {/* stock */}
            <div
                // onClick={()=> handleTypeClick('Stock')} 
                className='flex hover:scale-105 ease-in-out m-auto mt-5 animate__animated animate__fadeIn'>
                <Card sx={{ maxWidth: 300,borderColor:currentColor , borderWidth: userData.type === 2 ?'2px':'0px'  }}>
                    <CardActionArea onClick={()=> handleTypeClick('Stock')} >
                        <CardMedia
                            component="img"
                            image={stock_img}
                            alt=""
                            sx={{ padding: "1em 1em 0 1em", objectFit: "contain", width:345, height:100 }}
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Stock Market
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align='left'>
                        &#x2022; Operates on a schedule.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align='left'>
                        &#x2022; Regulated by government agencies
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align='left'>
                        &#x2022; Less risk.(compare with crypto)
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
            {/* random */}
            {/* <div
                // onClick={()=> handleTypeClick('Stock')} 
                className='flex hover:scale-105 ease-in-out m-auto mt-5 animate__animated animate__fadeIn'>
                <Card sx={{ maxWidth: 300,borderColor:currentColor , borderWidth: userData.type === 3 ?'2px':'0px'  }}>
                    <CardActionArea onClick={()=> handleTypeClick('Random')} >
                        <CardMedia
                            component="img"
                            image={random_img}
                            alt=""
                            sx={{ padding: "1em 1em 0 1em", objectFit: "contain", width:345, height:100 }}
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Random Data
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align='left'>
                        &#x2022; Randomly generate market data
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align='left'>
                        &#x2022; Unpredictable manner
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align='left'>
                        &#x2022; Your result can show in Leader board
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div> */}
        </div>


    )
  return (
    <div>
        <div>
            {marketType}
            {userData.type === 0 || userData.type === undefined? <></> 
            // 1(crypto) or 2(stock)?
            : userData.type === 1? 
            <CryptoFrom/> 
            : userData.type === 2? 
            <StockForm/>
            : 
            <RandomForm/>
        }
        </div>
    </div>
  )
}

export default PickTrade