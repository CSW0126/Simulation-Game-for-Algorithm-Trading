import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';

const LineChart = (props) => {
  const {candData} = props
  const	backgroundColor = 'white'
	const	lineColor = '#2962FF'
	const	textColor = 'black'
	const	areaTopColor = '#2962FF'
	const	areaBottomColor = 'rgba(41, 98, 255, 0.28)'
	const chartContainerRef = useRef();
  const [name, setName]= useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(
		() => {
      setName(candData.name)
      setFrom(candData.data[0].time)
      setTo(candData.data[candData.data.length -1].time)
			const handleResize = () => {
				chart.applyOptions({ width: chartContainerRef.current.clientWidth, localization:{
          locale: 'en-US',
          dateFormat: 'YYYY-MMM-DD'
        }, });
			};

			const chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: backgroundColor },
					textColor,
				},
				width: chartContainerRef.current.clientWidth,
				height: 300,
			});
			chart.timeScale().fitContent();

			// const newSeries = chart.addAreaSeries();
			// newSeries.setData(currentData);

      const candlestickSeries = chart.addCandlestickSeries();
      candlestickSeries.setData(candData.data)

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};
		},
		[candData, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
	);
  return (
    <div className='container px-10 py-5'>
        <p className='flex items-center gap-5 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 m-2'>{name.toString()}</p>
        <p className='flex items-center gap-5 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 m-2'>From {from.toString()} to {to.toString()}</p>
        <div
          ref={chartContainerRef}
        />
    </div>

  )
}

export default LineChart