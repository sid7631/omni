import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FileUpload from '../common/FileUpload';
import DateDropdown from '../common/DateDropdown';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { getHoldings, upload_holdings_url } from '../common/api';
import { IconButton } from '@mui/material';
import Fingerprint from '@mui/icons-material/Fingerprint';
import HoldingsTable from '../common/HoldingsTable';
import { useAlert } from '../common/AlertContext';
import PieChart from './PieChart';
import { extractSectors } from '../common/utils';


const headCells = [
    {
        id: 'symbol',
        numeric: false,
        disablePadding: true,
        label: 'Symbol',
    },
    {
        id: 'quantity_available',
        numeric: true,
        disablePadding: false,
        label: 'Quantity',
    },
    {
        id: 'average_price',
        numeric: true,
        disablePadding: false,
        label: 'Buy Avg.',
    },
    {
        id: 'invested',
        numeric: true,
        disablePadding: false,
        label: 'Invested',
    },
    {
        id: 'previous_closing_price',
        numeric: true,
        disablePadding: false,
        label: 'LTP',
    },
    {
        id: 'value',
        numeric: true,
        disablePadding: false,
        label: 'Present Value',

    },
    {
        id: 'unrealized_pl',
        numeric: true,
        disablePadding: false,
        label: 'P&L',
    },
    {
        id: 'unrealized_pl_pct',
        numeric: true,
        disablePadding: false,
        label: 'P&L%',
    },
    {
        id: 'weight',
        numeric: true,
        disablePadding: false,
        label: 'Weightage'
    }
];



const Holdings = () => {

    const { showAlert } = useAlert();

    const [holdings, setholdings] = useState(null);
    const [summary, setsummary] = useState(null);
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [selectedSectors, setselectedSectors] = useState(null);

    useEffect(() => {
        fetchData(true)
    }, [])


    const fetchData = async (isInitial=false) => {


        
        if (selectedDate === null && isInitial === false) {
            showAlert('Select a date to fetch holdings', 'error');
        }

        const params = {
            date: selectedDate
        }
        try {
            const response = await getHoldings(params)
            if (response.status === 200) {
                console.log(response)
                setholdings(response.data.holdings)
                setsummary(response.data.summary)
            }
        } catch (error) {
            console.log(error)
        }

    }

    console.log(holdings)

    


    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const groupData = () => {
        const groupedBySymbol = holdings.reduce((acc, curr) => {
            const symbol = curr.symbol;
            if (!acc[symbol]) {
              acc[symbol] = {
                  quantity_available:0,
                  invested: 0,
                value: 0,
                unrealized_pl: 0,
                unrealized_pl_pct: 0,
              };
            }
            acc[symbol].quantity_available +=  curr.quantity_available;
            acc[symbol].invested += curr.invested;
            acc[symbol].average_price = acc[symbol].invested/acc[symbol].quantity_available;
            acc[symbol].value += curr.value;
            acc[symbol].unrealized_pl += curr.unrealized_pl;
            acc[symbol].unrealized_pl_pct = acc[symbol].invested ? (acc[symbol].value-acc[symbol].invested)/acc[symbol].invested*100 : null;
            acc[symbol].sector = curr.sector;
            acc[symbol].record_date = curr.record_date;
            acc[symbol].previous_closing_price = curr.previous_closing_price;
            acc[symbol].weight = summary.value ? (acc[symbol].value/summary.value)*100 : 0;
            return acc;
          }, {});

          const newData = Object.entries(groupedBySymbol).map(([symbol, values]) => {
            return {
              symbol,
              ...values
            };
          });

          return newData
    }

    const filterHoldings = (param) => {



        if (param === null) {
            return groupData()
        } else {
            return groupData().filter((holding) => holding.sector === param);
        }
    }

    const updateSelectedSectors = (param) => {
        setselectedSectors(param)
    }

    return (
        <Box>
            <Box width='100%' sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <DateDropdown label={'Date'} handleDateChange={handleDateChange} selectedDate={selectedDate} />
                    <IconButton aria-label="fingerprint" color="primary" sx={{ ml: 2 }} size="large" onClick={fetchData}>
                        <SendIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'block', width: '30%' }}>
                    <FileUpload server={upload_holdings_url} title='Holdings' allowMultiple={false} maxFiles={1} />
                </Box>

            </Box>
            {holdings === null || summary === null ?
                ''
                :
                <>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        {holdings.length && <>
                            <Box>
                                <PieChart data={groupData()} chartType='stock' />
                            </Box>
                            <Box>
                                <PieChart data={groupData()} chartType='sector' updateCallback={updateSelectedSectors} />
                            </Box>
                        </>}
                    </Box>
                    <HoldingsTable title='Holdings' data={filterHoldings(selectedSectors)} headCells={headCells} headerSummary={summary} />
                </>

            }
        </Box>
    );
};

export default Holdings;
