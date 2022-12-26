import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';


const ProfitMovementChart = ({data, ruleData}) => {

	const backgroundColor = 'white'
	const lineColor = data[data.length-1]?.value >= ruleData.investment ? "#4CAF50": "#FF5252"
	const textColor = 'black'
	const areaTopColor = data[data.length-1]?.value >= ruleData.investment ? "#4CAF50": "#FF5252"
    const areaBottomColor = data[data.length-1]?.value >= ruleData.investment ? "rgba(76, 175, 80,0.28)": "rgba(239, 83, 80, 0.28)"
	
	const chartContainerRef = useRef();

    const PriceLine = {
		price: ruleData.investment,
		color: data[data.length-1]?.value >= ruleData.investment ? "#FF5252":"#4CAF50",
		lineWidth: 2,
		lineStyle: 0,
		axisLabelVisible: true,
		title: 'Initial Investment',
	}

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
                localization: {
                    dateFormat: 'yyyy-MM-dd',
                    locale:'en-US'
                },
			});
			chart.timeScale().fitContent();

			const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
			newSeries.setData(data);
            newSeries.createPriceLine(PriceLine)
            // newSeries.setMarkers()

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};
		},[data]);

	return (
		<div
			ref={chartContainerRef}
		/>
	);
}

export default ProfitMovementChart