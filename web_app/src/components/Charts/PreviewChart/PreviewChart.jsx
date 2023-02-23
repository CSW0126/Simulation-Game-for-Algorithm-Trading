import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';

const PreviewChart = (props) => {
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
  const [displayPrice, setDisplayPrice] = useState({
    open:0,
    high:0,
    low:0,
    close:0,
    volume:0
  })
    // c*number
    // The close price for the symbol in the given time period.

    // h*number
    // The highest price for the symbol in the given time period.

    // l*number
    // The lowest price for the symbol in the given time period.

    // ninteger
    // The number of transactions in the aggregate window.

    // o*number
    // The open price for the symbol in the given time period.

    // t*integer
    // The Unix Msec timestamp for the start of the aggregate window.

    // v*number
    // The trading volume of the symbol in the given time period.

    // vwnumber
    // The volume weighted average price.

  useEffect(
		() => {
      setName(candData.name)
      setFrom(candData.data[0].time)
      setTo(candData.data[candData.data.length -1].time)
			const handleResize = () => {
				chart.applyOptions({ width: chartContainerRef.current.clientWidth});
			};

			const chart = createChart(chartContainerRef.current, {
				layout: {
					background: { type: ColorType.Solid, color: backgroundColor },
					textColor,
				},
				width: chartContainerRef.current.clientWidth,
				height: 500,
        priceScale: {
          scaleMargins: {
            top: 0.05,
            bottom: 0.3,
          },
          borderVisible: false,
        },
        localization: {
          dateFormat: 'yyyy-MM-dd',
          locale: 'en-US'
      },
			});
			chart.timeScale().fitContent();

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

      volumeSeries.setData(candData.data)
			// const newSeries = chart.addAreaSeries();
			// newSeries.setData(currentData);

      const candlestickSeries = chart.addCandlestickSeries();
      candlestickSeries.setData(candData.data)

      chart.subscribeCrosshairMove((param) => {
        if (param.time) {
          try{
            const price = param.seriesPrices.get(candlestickSeries);
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

			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};


		},
		[candData, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
	);
  return (
    <div className='container px-10 py-5'>
        <div className='container flex flex-row flex-wrap'>
            <div className='flex'>
              <p className='flex gap-5 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 m-2 text-left'>
                <span className='font-bold'>{name.toString()}</span> Data From
                <span className='font-bold'>{from.toString()}</span> to
                <span className='font-bold'>{to.toString()}</span></p>
            </div>
        </div>
        <div className='container flex flex-row flex-wrap'>
          <div className='flex'>
            <p className='gap-5 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 m-2 text-left text-sm'>High : 
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.high}</span> - Low:&nbsp;
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.low}</span> - Open:&nbsp;
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.open}</span> - Close:&nbsp;
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.close}</span> - Volume:&nbsp;
              <span className={`font-bold ${displayPrice.close >= displayPrice.open ? "text-green-600" : "text-rose-600"}`}>{displayPrice.volume}</span>
            </p>
          </div>
        </div>
        <div
          ref={chartContainerRef}
        />
    </div>

  )
}

export default PreviewChart