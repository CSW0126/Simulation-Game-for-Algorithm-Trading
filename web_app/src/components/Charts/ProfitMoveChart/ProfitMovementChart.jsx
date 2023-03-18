import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment'
import APICall from '../../../apiCall/API';


const ProfitMovementChart = ({data, ruleData, rawData}) => {

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

        const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
        newSeries.setData(data);
        newSeries.createPriceLine(PriceLine)
        // newSeries.setMarkers()

        chart.subscribeCrosshairMove((param) => {

            try{
                const price = param.seriesPrices.get(newSeries);

                if (param.point == undefined 
                    || !param.time 
                    || param.point.x < 0 
                    || param.point.x > chartContainerRef.current.clientWidth 
                    || param.point.y < 0 
                    || param.point.y > chartContainerRef.current.clientHeight) 
                {
                    toolTip.style.display = 'none';
                } else {
                //   setDisplayPrice({
                //       open:price.open,
                //       high: price.high,
                //       low:price.low,
                //       close:price.close,
                //       volume:vol.toFixed(2)
                //     })
                    let month =  param.time.month
                    if (month.toString().length == 1) month = "0" + month
                    let day = param.time.day
                    if (day.toString().length == 1) day = "0" + day

                    let dateStr = param.time.year + "-" + month + "-" + day
                    let dataObj = {}
                    toolTip.style.display = 'block';

                    let round = 0
                    let holdingAssets = 0
                    let holdingUSD = 0
                    let holdingValue = 0
                    let currentPrice = 0
                    if(ruleData.algoType == 1){
                        dataObj = rawData.find(ele => ele.time == dateStr)
                        round = dataObj?.round
                        holdingAssets = APICall.HandleGetCoinToFixed(dataObj?.holdingShares, ruleData.pair)
                        holdingUSD = dataObj?.holdingUSD.toFixed(2)
                        holdingValue = dataObj?.holdingValue.toFixed(2)
                        currentPrice = handleToFixed(dataObj?.price)
                    }else if(ruleData.algoType == 3){
                        dataObj = rawData.message.find(ele => moment(ele.time).format("YYYY-MM-DD") == dateStr)
                        round = dataObj?.round
                        holdingAssets = APICall.HandleGetCoinToFixed(dataObj?.holdingShare, ruleData.pair)
                        holdingUSD = dataObj?.holdingUSD.toFixed(2)
                        holdingValue = (dataObj?.sharesValueInUSD + dataObj?.holdingUSD).toFixed(2)
                        currentPrice = handleToFixed(dataObj?.currentPrice)
                    }
                    toolTip.innerHTML = 
                    `
                    <div className="grid grid-cols-2">
                        ${dateStr} :
                    </div>
                    <div className="">
                        Round : ${round}
                    </div>
                    <div className="">
                        Holding Assets : ${holdingAssets}
                    </div>
                    <div className="">
                        Holding USD : $${holdingUSD}
                    </div>
                    <div className="">
                        Holding Value : $${holdingValue}
                    </div>
                    <div className="">
                        Current Price : $${currentPrice}
                    </div>
                    `
                    var coordinate = newSeries.priceToCoordinate(price);
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

	return (
		<div
        className='relative'
			ref={chartContainerRef}
		/>
	);
}

export default ProfitMovementChart