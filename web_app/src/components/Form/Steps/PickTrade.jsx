import React, {useContext, useEffect, useState} from 'react'
import { StepperContext } from '../../../contexts/StepperContext'
import crypto_img from '../../../data/eth-btc.png'
import stock_img from '../../../data/stock-market.jpg'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useStateContext } from '../../../contexts/ContextProvider';
import CryptoFrom from './CryptoFrom';
import StockForm from './StockForm';


const PickTrade = ({handlePreview}) => {
    const {userData, setUserData} = useContext(StepperContext)
    const { currentColor } = useStateContext();

    //crypto = 1, stock = 2
    const [type, setType] = useState(0);
    //if crypto
    const [pair, setPair] = useState('')


    const handleChange = (e) =>{
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
    }

    const handleTypeClick = (selectType) =>{
        if (selectType === 'Crypto'){
            setType(1)
            setUserData({
                ...userData,
                type:1,
                pair: "X:BTCUSD"
            })
        }else if(selectType === 'Stock'){
            setType(2)
            setUserData({
                ...userData,
                type:2
            })
        }
    }

    const marketType = (
        <div className='flex place-content-center flex-row flex-wrap'>
            <button 
                onClick={()=> handleTypeClick('Crypto')}
                className='flex hover:scale-105 ease-in-out m-auto mt-5'>
                <Card sx={{ maxWidth: 300, height:320, borderColor:currentColor , borderWidth: type === 1 ?'2px':'0px'  }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            image={crypto_img}
                            alt=""
                            sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Crypto Market
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align='left'>
                                <ul className='list-disc pl-5'>
                                    <li>The crypto market is a 24/7 market.</li>
                                    <li>The price movement are usually large.</li>
                                    <li>Very High risk.</li>
                                </ul>
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </button>

            <button
                onClick={()=> handleTypeClick('Stock')} 
                className='flex hover:scale-105 ease-in-out m-auto mt-5'>
                <Card sx={{ maxWidth: 300, height:320,borderColor:currentColor , borderWidth: type === 2 ?'2px':'0px'  }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            image={stock_img}
                            alt=""
                            sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                        />
                        <CardContent>
                            <div className='pt-12 mt-1'></div>
                        <Typography gutterBottom variant="h5" component="div">
                            Stock Market
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align='left'>
                            <ul className='list-disc pl-5'>
                                <li>The stock market operates on a schedule.</li>
                                <li>Contain Day open/Day Close field</li>
                                <li>Normal risk.</li>
                            </ul>
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </button>
        </div>


    )
  return (
    <div>
        <div>
            {marketType}
            {type === 0 ? <></> 
            // 1(crypto) or 2(stock)?
            : type === 1? 
            <CryptoFrom
                setPair={setPair}
                handlePreview={handlePreview}
            /> 
            : 
            <StockForm/>}
        </div>
    </div>
  )
}

export default PickTrade