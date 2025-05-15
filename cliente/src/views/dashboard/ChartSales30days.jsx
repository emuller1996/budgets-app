/* eslint-disable prettier/prettier */

import React, { useEffect, useRef } from 'react'
import { AreaSeries, createChart } from 'lightweight-charts'
import PropTypes from 'prop-types'

const ChartSales30days = ({ data, formatCop = false }) => {
  ChartSales30days.propTypes = {
    data: PropTypes.array,
    formatCop: PropTypes.bool,
  }
  const chartContainerRef = useRef(null)

  const currentLocale = window.navigator.languages[0]
  const myPriceFormatter = Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency: 'COP', // Currency for data points
  }).format

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300, // Altura de la gráfica
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#000',
      },
      grid: {
        vertLines: { color: '#e1e1e1' },
        horzLines: { color: '#e1e1e1' },
      },
    })
    chart.applyOptions({
      localization: formatCop
        ? {
            priceFormatter: myPriceFormatter,
          }
        : {},
    })
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#7429ff',
      topColor: '#9829ff',
      bottomColor: 'rgba(80, 41, 255, 0.28)',
    })

    areaSeries.setData(data)

    chart.timeScale().fitContent()

    return () => chart.remove()
  }, [])

  return <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />
}

export default ChartSales30days
