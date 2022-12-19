import React,{useContext} from 'react'
import { StepperContext } from '../../../contexts/StepperContext'
import { useStateContext } from '../../../contexts/ContextProvider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import dcaImage from '../../../data/DCA.jpg'
import martingaleImage from '../../../data/martingale.png'
import indImage from '../../../data/ind.jpg'

const AlgoSelect = () => {
  const { currentColor } = useStateContext();
  const {userData, setUserData} = useContext(StepperContext)
  const cardData = [
    {
      index: 1,
      name: 'Martingale',
      desc: 'After a while she raised herself on her elbows, her face tight with pain and her expression almost happy.',
      img: martingaleImage
    },
    {
      index: 2,
      name: 'Dollar-Cost Averaging',
      desc: 'After a while she raised herself on her elbows, her face tight with pain and her expression almost happy.',
      img: dcaImage
    },
    {
      index: 3,
      name: 'Indicator',
      desc: 'After a while she raised herself on her elbows, her face tight with pain and her expression almost happy.',
      img: indImage
    }
  ]

  const handleAlgoSelect = (algoType) =>{
    console.log(algoType)
    setUserData({
      ...userData,
      algoType: algoType
    })
  }
  return (
    <div className='flex flex-wrap'>
        {cardData.map((item)=>(
          <div key={item.index} className="m-auto flex mt-5">
              <Card sx={{ width: 300 , borderColor:currentColor ,borderWidth: userData.algoType === item.index ? '3px':'0px'}}>
                <CardActionArea
                  onClick={()=>handleAlgoSelect(item.index)}
                >
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
                    <Typography variant="body2" color="text.secondary">
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