import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { formatDataForSectorChart, formatDataForStockChart } from '../common/utils';
import drilldown from 'highcharts/modules/drilldown';

drilldown(Highcharts)

const PieChart = ({ data, chartType = 'stock' ,drilldown = false, name = 'symbol', y = 'weight', title = 'Stock Holdings Distribution', updateCallback=null }) => {

  if(chartType === 'sector') {
    const options = formatDataForSectorChart(data, updateCallback)
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options}>
        </HighchartsReact>
      </div>
    );
  } else if(chartType === 'stock') {
    const options = formatDataForStockChart(data)
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options}>
        </HighchartsReact>
      </div>
    );
  }

};

export default PieChart;
