import { Box } from "@mui/material";

export const formatAmount = (amount) => {
    return amount.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });
}

export function plMarker(num, percentage = false, prefix = false, prefixTextPositive='', prefixTextNegative='') {
    const formatedNum = num.startsWith('-')

    

    if (formatedNum === false) {
        return <Box sx={{ color: '#339966' }}>{prefix? prefixTextPositive: ''}{num}{percentage ? '%' : ''}</Box>
    } else {
        return <Box sx={{ color: 'error.main' }}>{prefix? prefixTextNegative: ''}{num}{percentage ? '%' : ''}</Box>
    }
}

export const extractSectors = (data) => {

    // Extract sectors and count their occurrences
    const sectorCounts = data.reduce((counts, holding) => {
        const sector = holding.sector || 'Others'; // Use 'Others' if sector is not present
        counts[sector] = (counts[sector] || 0) + 1;
        return counts;
    }, {});

    // Convert the counts into an array of objects for easy mapping
    const sectorData = Object.entries(sectorCounts).map(([sector, count]) => ({
        sector,
        count,
    }));

    console.log('sectorData', sectorData)

    return sectorData
}

export const formatDataForStockChart = (data) => {
    const chartData = data.map((holding) => ({
        name: holding.symbol,
        y: holding.value,
    }));

    return {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Weight-wise Distribution of Stocks',
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
        tooltip: {
            formatter: function () {
                console.log(this)
                return '<b>' + this.point.name + '</b> :  <b> &#8377;' + this.y + '</b>';
            }
        },
        series: [
            {
                name: 'Sectors',
                colorByPoint: true,
                data: chartData,
            },
        ],
        credits: {
            enabled: false
        },
    };
}

export const formatDataForSectorChart = (data, callbacks) => {
    const sectorCounts = data.reduce((counts, holding) => {
        const sector = holding.sector || 'Others';
        counts[sector] = (counts[sector] || 0) + 1;
        return counts;
    }, {});

    const mainChartData = Object.entries(sectorCounts).map(([sector, count]) => ({
        name: sector,
        y: count,
        drilldown: sector,
    }));

    const drilldownSeries = Object.entries(sectorCounts).map(([sector, count]) => {
        const sectorData = data.filter((holding) => holding.sector === sector)
            .map((holding) => ({
                name: holding.symbol,
                y: holding.value,
            }));

        return {
            id: sector,
            data: sectorData,
        };
    });


    const handleDrilldown = (event) => {
        if (event.point) {
          const selectedOption = event.point.name;
          callbacks(selectedOption)
        }
      };

    const handleDrillUp = (event) => {
        if (event.type === 'drillupall') {
            callbacks(null)
        }
    }

    return {
        chart: {
            type: 'pie',
            events: {
                drilldown: handleDrilldown,
                drillupall: handleDrillUp
            },
        },
        title: {
            text: 'Sector-wise Distribution of Stocks',
        },

        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                },
                innerSize: '50%',
            },
        },
        tooltip: {
            formatter() {
                return this.series.name === 'Sectors' ? this.point.name : `${this.point.name}:  <b> &#8377;${this.y}</b>`;
            },
        },
        series: [
            {
                name: 'Sectors',
                colorByPoint: true,
                data: mainChartData,
            },
        ],
        drilldown: {
            series: drilldownSeries,
            breadcrumbs: {
                floating:true
            }
        },
        credits: {
            enabled: false,
        },
    };
};


