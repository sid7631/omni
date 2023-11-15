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
        id:'weight',
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


    const fetchData = async () => {

        if (selectedDate === null) {
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


    return (
        <Box>
            <Box width='100%' sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
            {holdings === null || summary === null?
                ''
                :
                <>
                
                <HoldingsTable title='Holdings' data={holdings} headCells={headCells} headerSummary={summary} />
                {holdings.length > 0 ? <PieChart data={holdings} /> : ''}
                </>

            }
        </Box>
    );
};

export default Holdings;
