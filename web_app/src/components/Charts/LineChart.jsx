import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

const LineChart = (props) => {
  const {currentData, candData} = props
  const	backgroundColor = 'white'
	const	lineColor = '#2962FF'
	const	textColor = 'black'
	const	areaTopColor = '#2962FF'
	const	areaBottomColor = 'rgba(41, 98, 255, 0.28)'
		
	
	const chartContainerRef = useRef();

  useEffect(
		() => {
			const handleResize = () => {
				chart.applyOptions({ width: chartContainerRef.current.clientWidth });
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

			const newSeries = chart.addAreaSeries();
			newSeries.setData(currentData);

      const candlestickSeries = chart.addCandlestickSeries();
      candlestickSeries.setData(candData)

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};
		},
		[currentData, candData, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
	);
  return (
    <div
      ref={chartContainerRef}
    />
  )
}

export default LineChart