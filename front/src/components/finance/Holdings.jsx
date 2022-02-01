import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import HoldingsTable from '../common/HoldingsTable';
import axios from 'axios';
import FileUpload from '../common/FileUpload';

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
        label: 'Buy Price',
    },
    {
        id: 'previous_closing_price',
        numeric: true,
        disablePadding: false,
        label: 'Prev. Close',
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
];



const Holdings = () => {

    const [holdings, setholdings] = useState([]);
    const [summary, setsummary] = useState({});

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/holdings')
                if (response.status === 200) {
                    console.log(response)
                    setholdings(response.data.holdings)
                    setsummary(response.data.summary)
                }
            } catch (error) {
                console.log(error)
            }

        }

        fetchData()


    }, []);


    return (
        <Box>
            <Box width='30%'>
                <FileUpload server='http://localhost:8000/upload_holdings' title='Holdings' allowMultiple={false} maxFiles={1} />
            </Box>

            <HoldingsTable title='Holdings' data={holdings} headCells={headCells} headerSummary={summary} />
        </Box>
    );
};

export default Holdings;
