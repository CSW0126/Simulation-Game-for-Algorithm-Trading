import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import AnimateChartComp from './AnimateChartComp';


const AnimateChart = ({data, speed, simulationData, displayPrice, setDisplayPrice}) => {

  return (
    <AnimateChartComp data={data} speed={speed} simulationData={simulationData} displayPrice={displayPrice} setDisplayPrice={setDisplayPrice}></AnimateChartComp>
  )
}

export default AnimateChart