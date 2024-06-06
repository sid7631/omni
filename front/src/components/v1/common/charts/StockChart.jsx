import React, { useEffect } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { formatAmount, plMarker } from '../utils';

const StockChart = ({ stockData, title, ltp, previous_close, buy_price, target_price }) => {
  useEffect(() => {
    // Customize and update chart options here if needed
  }, [stockData]);

  const options = {
    chart: {
      height: 200,
      backgroundColor: '#ACC57F',
    },
    title: {
      useHTML: true,
      text: `
      <div style="display: flex; justify-content: space-between; flex-direction: column">
        <div style="margin-bottom:2px">${title}</div>
        <div style="display: flex; justify-content: space-between;">
          <div style="font-size: 14px; font-weight:400; color:#FFFFFF">&#8377;${formatAmount(ltp)}</div>
          <div style="font-size: 14px; font-weight:400; color:#FFFFFF; display: flex; margin-left: 8px;">${formatAmount(ltp - previous_close)}</div>
          <div style="font-size: 14px; font-weight:400; color:#FFFFFF; display: flex;">(${formatAmount((ltp - previous_close) / previous_close * 100)}%)</div>
        </div>
      </div>
    `,

      // text: title, // Set the text of the title
      align: 'left', // Align the title to the left
      verticalAlign: 'top', // Align the title to the top
      x: 20, // Set the x position of the title
      y: 30, // Set the y position of the title,
      style: {
        color: '#FFFFFF', // Set the color of the title text
        // fontSize: '16px', // Set the size of the title text
      },
    },
    subtitle: {
      useHTML: true,
      text: `
      <div style="display: flex; justify-content: space-between; flex-direction: column">
      <div style="display: flex; justify-content: flex-end;flex-direction: column; align-items:flex-start">
        <div style="font-size: 14px; font-weight:400; color:#FFFFFF; display: flex;">ENTRY   : ${formatAmount(buy_price)}</div>
        <div style="font-size: 14px; font-weight:400; color:#FFFFFF; display: flex;"> TARGET: ${formatAmount(target_price)}</div>
      </div>
    </div>
  `,
  
      align: 'right', // Align the subtitle to the left
      verticalAlign: 'top', // Align the subtitle to the top
      x: -20, // Set the x position of the subtitle
      y: 25, // Set the y position of the subtitle
      style: {
        color: '#FFFFFF', // Set the color of the subtitle text
        // fontSize: '12px', // Set the size of the subtitle text
      }
    },
    xAxis: {
      categories: stockData.map((dataPoint) => dataPoint.Datetime),
      labels: {
        enabled: false, // Set this to false to hide x-axis labels
      },
      lineWidth: 0, // Set lineWidth to 0 to remove x-axis line
    },
    legend: {
      enabled: false, // Set this to false to hide the legend
    },
    yAxis: {
      title: {
        text: '', // Set an empty string to disable the yAxis title
        labels: {
          enabled: false, // Set this to false to hide y-axis labels
        },
      },
      gridLineColor: '#cccccc', // Set the color of the gridlines
      gridLineWidth: 1, // Set the width of the gridlines
      // gridLineWidth: 0, // Set gridLineWidth to 0 to remove horizontal lines on y-axis
      labels: {
        enabled: false, // Set this to false to hide y-axis labels
      },
    },
    plotOptions: {
      candlestick: {
        color: 'red',
        upColor: 'green',
      },
      series: {
        marker: {
          enabled: false, // Set this to false to hide the markers
        },
      },
    },
    tooltip: {
      enabled: true, // Set this to true to show the tooltip
      // backgroundColor: '#FCFFC5', // Set the background color of the tooltip
      // borderColor: 'black', // Set the border color of the tooltip
      // borderRadius: 10, // Set the border radius of the tooltip
      // borderWidth: 1, // Set the border width of the tooltip
      formatter: function () {
        return '&#8377;' + formatAmount(this.y);
      }
    },
    series: [
      {
        type: 'line',
        name: 'Stock Price',
        color: '#FFFFFF',
        lineWidth: 3, // Increase the line width
        linecap: 'round', // Make the line smooth
        states: {
          hover: {
            lineWidth: 5 // Make the line bold when hovered over
          }
        },
        data: stockData.map((dataPoint) => [
          // dataPoint.Datetime,
          // dataPoint.Open,
          // dataPoint.High,
          // dataPoint.Low,
          dataPoint.Close,
        ]),
      },
    ],
    credits: {
      enabled: false, // Set this to false to remove credits link
    },

  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default StockChart;
