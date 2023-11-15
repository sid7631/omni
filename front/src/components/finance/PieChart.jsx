import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieChart = ({ data, name='symbol', y='weight', title='Stock Holdings Distribution' }) => {
  // Transform data into a format suitable for Highcharts
  
  const chartData = data.map((holding) => ({
    name: holding[name],
    y: holding[y],
  }));

  console.log(chartData)

  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Stock Holdings Distribution',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.2f} %',
        },
      },
    },
    series: [
      {
        name: 'Stocks',
        colorByPoint: true,
        data: chartData,
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart;
