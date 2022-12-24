import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment'

const AnimateChartComp = (props) => {
    const backgroundColor = 'white'
    const lineColor = '#2962FF'
    const textColor = 'black'
    const areaTopColor = '#2962FF'
    const areaBottomColor = 'rgba(41, 98, 255, 0.28)'
	const {data, simulationData, displayPrice, setDisplayPrice} = props;
    const speed = props.speed ? props.speed : 100
	const chartContainerRef = useRef();
    const maxBar = 50

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

	useEffect(async() => {
        console.log(simulationData)
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
                priceScale: {
                    scaleMargins: {
                      top: 0.05,
                      bottom: 0.3,
                    },
                    borderVisible: false,
                  },
                  localization: {
                    dateFormat: 'yyyy-MM-dd',
                    locale:'en-US'
                },
			});

            const volumeSeries = chart.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {
                  type: 'volume',
                },
                priceScaleId: '',
                scaleMargins: {
                  top: 0.8,
                  bottom: 0,
                },
              })
            volumeSeries.setData([])
			const candleSeries = chart.addCandlestickSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
			candleSeries.setData([]);
            candleSeries.setMarkers(simulationData)

            const play = async(chart)=>{
                try{
                    let count = 0
                    for(let item of data){
                        count ++
                        candleSeries.update(item);
                        volumeSeries.update(item)
                        if (count <= maxBar) chart.timeScale().fitContent();
                        await sleep(speed)
                    }
                }catch(e){
                    console.log(e)
                    console.log("navigate change, stop render")
                }
            }
            chart.subscribeCrosshairMove((param) => {
                if (param.time) {
                  try{
                    const price = param.seriesPrices.get(candleSeries);
                    const vol = param.seriesPrices.get(volumeSeries)
                    // console.log(vol)
                    setDisplayPrice({
                      open:price.open,
                      high: price.high,
                      low:price.low,
                      close:price.close,
                      volume:vol.toFixed(2)
                    })
                  }catch(e){
                    console.log(e)
                  }

                }
              });

			window.addEventListener('resize', handleResize);

            //chart animate
            await play(chart, candleSeries)
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

export default AnimateChartComp