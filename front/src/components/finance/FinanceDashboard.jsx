import { Box, minHeight } from '@mui/system';
import React from 'react';
import FileUpload from '../common/FileUpload';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import CardDashboard from '../common/CardDashboard';


const finance_cards = [
    {
        title: 'Bank',
        description: 'Track your investment ',
        meta: 'Track Your Finance',
        route: '/finance/bankaccounts'
    },
    {
        title: 'Holdings',
        description: 'Track your Personal items',
        meta: 'Track Your Finance',
        route: '/finance/holdings'
    },
]

const FinanceDashboard = () => {

    return (
        <>
            <Grid container spacing={{ xs: 2, sm: 2, md: 2, lg: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
                {finance_cards.map((item, index) => (
                    <Grid item xs={4} sm={4} md={2} lg={2} key={index}>
                        <CardDashboard {...item} />
                    </Grid>
                ))}
            </Grid>
        </>
        // <Box width='100vw' display='flex'>
        //     <Box width='50%' display='flex' flexDirection='column' alignItems='center' justifyContent='space-between' >
        //         <Box width={'60%'}>
        //             <FileUpload server='http://localhost:8000/upload_holdings' title='Holdings' allowMultiple={false} maxFiles={1} />
        //         </Box>
        //         <Box width={'60%'}>
        //             <FileUpload server='http://localhost:8000/upload_ledger' title='ledger' allowMultiple={false} maxFiles={1} />
        //         </Box>
        //         <Box width={'60%'}>
        //             <FileUpload server='http://localhost:8000/upload_tradebook' title='tradebook' allowMultiple={false} maxFiles={1} />
        //         </Box>
        //         <Box width={'60%'}>
        //             <FileUpload server='http://localhost:8000/upload_bank_transactions' title='bank transactions' allowMultiple={false} maxFiles={1} />
        //         </Box>
        //     </Box>
        // </Box>
    );
};

export default FinanceDashboard;
