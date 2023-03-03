import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment'
import APICall from '../../../apiCall/API';

const DCAMovementChart = ({data, ruleData, rawData}) => {

	const backgroundColor = 'white'
	const textColor = 'black'
	const chartContainerRef = useRef();

    var toolTipWidth = 80;
    var toolTipHeight = 80;
    var toolTipMargin = 15;
    var toolTip = document.createElement('div');
    toolTip.className=" absolute hidden bg-white w-auto h-auto p-[8px] box-border text-xs z-[1000] top-3 left-3 pointer-events-none border rounded-sm border-cyan-700 text-left"
    
    const handleToFixed = (value) =>{
        try{
            let pair = ruleData.pair
            if(pair == "X:BTCUSD"){
                return value.toFixed(0)
            }else if(pair == "X:DOGEUSD"){
                return value.toFixed(5)
            }else if(pair == "X:MATICUSD"){
                return value.toFixed(4)
            }else if(pair == "X:ETHUSD"){
                return value.toFixed(0)
            }else{
                return value
            }

        }catch(e){
            console.log(e)
            return value
        }
      }

	useEffect(() => {
        // console.log(rawData)
        chartContainerRef.current.appendChild(toolTip)
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

        const newSeries = chart.addLineSeries({color: "#E91E63"});
        const newSeriesUSD = chart.addLineSeries({ color : "#FB8C00"});

        let holdingSharesValue = APICall.ConvertToHoldingSharesValue(data)
        let usingUSDValue = APICall.ConvertToUsingUSD(data)
        // console.log(holdingSharesValue)
        newSeries.setData(holdingSharesValue);
        newSeriesUSD.setData(usingUSDValue)
        // newSeries.createPriceLine(PriceLine)
        // newSeries.setMarkers()

        chart.subscribeCrosshairMove((param) => {

            try{
                const holding = param.seriesPrices.get(newSeries);
                const investment = param.seriesPrices.get(newSeriesUSD)

                if (param.point == undefined 
                    || !param.time 
                    || param.point.x < 0 
                    || param.point.x > chartContainerRef.current.clientWidth 
                    || param.point.y < 0 
                    || param.point.y > chartContainerRef.current.clientHeight) 
                {
                    toolTip.style.display = 'none';
                } else {

                    let month =  param.time.month
                    if (month.toString().length == 1) month = "0" + month
                    let day = param.time.day
                    if (day.toString().length == 1) day = "0" + day

                    let dateStr = param.time.year + "-" + month + "-" + day
                    let currentPrice = APICall.GetCurrentPriceDCA(dateStr, data)
                    toolTip.style.display = 'block';
                    toolTip.innerHTML = 
                    `
                    <div className="grid grid-cols-2">
                        Time : ${dateStr}
                    </div>`
                    + 
                    `${ruleData.type == 2? `
                    <div>
                       Holding Shares : ${APICall.GetHoldingShares(dateStr,data)}
                    </div>
                    `: ""}`
                    +
                    `
                    <div>
                        Current Price: $${handleToFixed(currentPrice)}
                    </div>
                    <div className="">
                        Assets Value : $${holding.toFixed(2)}
                    </div>
                    <div className="">
                        Investment : $${investment.toFixed(2)}
                    </div>
                    <div className="">
                        ROI : ${(-(1-(holding/investment))*100).toFixed(2)} %
                    </div>
                    `
                    var coordinate = newSeries.priceToCoordinate(holding);
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
			window.addEventListener('resize', handleResize);
			return () => {
				window.removeEventListener('resize', handleResize);
				chart.remove();
			};
		},[data]);
    const ColoredLine = ({ color }) => (
            <hr
                style={{
                    color: color,
                    backgroundColor: color,
                    height: 5,
                    width: 25,
                    marginRight:5,
                    marginTop:5
                }}
            />
        );
	return (
        <div>
            <div className='flex justify-start'>
                <ColoredLine color="#EF9A3F" />
                <p className=' text-xs'>Investment In USD</p></div>
            <div className='flex justify-start mb-5'>
                <ColoredLine color="#E91E63" />
                <p className=' text-xs'>Holding Values In USD</p>
            </div>
           	<div className='relative' ref={chartContainerRef}/> 
        </div>

	);
}

export default DCAMovementChart