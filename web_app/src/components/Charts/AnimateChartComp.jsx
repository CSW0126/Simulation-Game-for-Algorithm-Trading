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
    const toolTipRef = useRef()
    const maxBar = 50
    const tooltipStyle ={
        
        "display": "hidden",
        "box-sizing": "border-box",
        "font-size": "12px",
        "color": "#131722",
        "background-color": "rgba(255, 255, 255, 1)",
        "text-align": "left",
        "z-index": 1000,
        "top": "12px",
        "left": "12px",
        "pointer-events": "none",
        "border": "1px solid rgba(0, 150, 136, 1)",
        "border-radius":" 2px"
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    var toolTipWidth = 80;
    var toolTipHeight = 80;
    var toolTipMargin = 15;
    var toolTip = document.createElement('div');
    toolTip.className="absolute hidden bg-white w-auto h-auto p-[8px] box-border text-xs z-[1000] top-3 left-3 pointer-events-none border rounded-sm border-cyan-700 text-left"

	useEffect(async() => {
        chartContainerRef.current.appendChild(toolTip)
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
            chart.subscribeCrosshairMove((param) => {

                        try{
                        //   if (param.time) {
                        //       try{
                        //         const price = param.seriesPrices.get(candleSeries);
                        //         const vol = param.seriesPrices.get(volumeSeries)
                        //         // console.log(vol)
                        //         setDisplayPrice({
                        //           open:price.open,
                        //           high: price.high,
                        //           low:price.low,
                        //           close:price.close,
                        //           volume:vol.toFixed(2)
                        //         })
                        //       }catch(e){
                        //         console.log(e)
                        //       }
                        //     }
                          const price = param.seriesPrices.get(candleSeries);
                          const vol = param.seriesPrices.get(volumeSeries)
          
                          if (param.point == undefined 
                              || !param.time 
                              || param.point.x < 0 
                              || param.point.x > chartContainerRef.current.clientWidth 
                              || param.point.y < 0 
                              || param.point.y > chartContainerRef.current.clientHeight) 
                          {
                              toolTip.style.display = 'none';
                          } else {
                              setDisplayPrice({
                                  open:price.open,
                                  high: price.high,
                                  low:price.low,
                                  close:price.close,
                                  volume:vol.toFixed(2)
                                })
                              toolTip.style.display = 'block';
                              toolTip.innerHTML = 
                              `
                              <div className="">
                                  open : ${price.open}
                              </div>
                              <div className="">
                                  high : ${price.high}
                              </div>
                              <div className="">
                                  low : ${price.low}
                              </div>
                              <div className="">
                                  close : ${price.close}
                              </div>
                              <div className="">
                                  volume : ${vol.toFixed(2)}
                              </div>`;
                              var coordinate = candleSeries.priceToCoordinate(price.close);
                              var shiftedCoordinate = param.point.x - 50;
                              if (coordinate === null) {
                                  return;
                              }
                              shiftedCoordinate = Math.max(0, Math.min(chartContainerRef.current.clientWidth - toolTipWidth, shiftedCoordinate));
                              var coordinateY = coordinate - toolTipHeight - toolTipMargin > 0 ? coordinate - toolTipHeight - toolTipMargin : Math.max(0, Math.min(chartContainerRef.current.clientHeight - toolTipHeight - toolTipMargin, coordinate + toolTipMargin));
                              toolTip.style.left = shiftedCoordinate + 'px';
                              toolTip.style.top = coordinateY + 'px';
                          }
                        }catch(e){
                          console.log(e)
                        }
      
                  });
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
            className='relative'
            ref={chartContainerRef}
        />

	);
}

export default AnimateChartComp