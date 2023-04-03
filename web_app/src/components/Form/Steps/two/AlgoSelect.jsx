import React,{useContext} from 'react'
import { StepperContext } from '../../../../contexts/StepperContext'
import { useStateContext } from '../../../../contexts/ContextProvider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardHeader } from '@mui/material';
import dcaImage from '../../../../data/DCA.jpg'
import martingaleImage from '../../../../data/martingale.png'
import indImage from '../../../../data/ind.jpg'

const AlgoSelect = () => {
  const { currentColor } = useStateContext();
  const {userData, setUserData} = useContext(StepperContext)
  const initPriceScaleData = [
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
  ]
  const cardData = [
    {
      index: 2,
      name: 'Dollar-Cost Averaging',
      desc: `Dollar-cost averaging is an investment strategy where an investor regularly invests a fixed amount of money into an asset over a period of time. This approach aims to reduce the impact of market volatility on an investor's portfolio and potentially result in a lower average cost per share.`,
      img: dcaImage,
      level: 1
    },
    {
      index: 1,
      name: 'Martingale',
      desc: 'Martingale is a betting strategy where an individual doubles their bet after every loss in the hope of recouping previous losses and achieving a profit. It is commonly used in gambling but is highly risky as it relies on the assumption of infinite wealth and that a winning bet is inevitable.',
      img: martingaleImage,
      level: 2
    },
    {
      index: 3,
      name: 'Custom Rules',
      desc: 'Custom Rules is a trading strategy that involves using multiple technical analysis tools to confirm trading signals and reduce false signals. This approach provides a more comprehensive understanding of market trends and helps traders make informed decisions when buying or selling securities.',
      img: indImage,
      level: 3
    }
  ]

  const handleAlgoSelect = (algoType) =>{
    if(algoType == 1){
      setUserData({
        ...userData,
        algoType: algoType,
        priceScaleData: initPriceScaleData
      })
    }else if(algoType == 2){
      setUserData({
        ...userData,
        algoType: algoType,
      })
    }else if (algoType == 3){
      const tempUserData = {...userData}
      delete tempUserData['ex1']
      delete tempUserData['ex2']
      delete tempUserData['sellEx1']
      delete tempUserData['sellEx2']
      tempUserData.algoType = algoType
      tempUserData.investment = 1000
      setUserData(tempUserData)
    }

  }
  return (
    <div className='flex flex-wrap'>
        {cardData.map((item)=>(
          <div key={item.index} className="m-auto flex mt-5">
              <Card sx={{ width: 300 , borderColor:currentColor ,borderWidth: userData.algoType === item.index ? '3px':'0px'}}>
                <CardActionArea
                  onClick={()=>handleAlgoSelect(item.index)}
                >
                  <CardHeader
                    title={"Level "+item.level}
                  >
                  </CardHeader>
                  <CardMedia
                    component="img"
                    height="100"
                    image={item.img}
                    alt=""
                    sx={{width:345, height:100}}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align='justify'>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
          </div>
        ))}

    </div>
  )
}

export default AlgoSelect