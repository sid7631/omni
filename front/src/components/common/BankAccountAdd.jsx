import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/system';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import axios from 'axios';
import { saveBankAccount } from './api';


export default function BankAccountAdd() {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [bank, setbank] = useState('');
    const [account, setaccount] = useState('');
    const [ifsc, setifsc] = useState('');


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = async () => {
        try {
            const params = {
                bank: bank,
                account: account,
                ifsc: ifsc
            }
            const response = await saveBankAccount(params)
            console.log(response);
            // TODO: Handle successful response for status code 200
            if(response.status === 200) {
                handleClose();
                navigate(0)
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open form dialog
            </Button> */}
            <BankAccountAddCard onClickEvent={handleClickOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Bank Details</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter Details To Add New Bank Account
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="bank"
                        label="Bank Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={bank} 
                        onChange={(event) => setbank(event.target.value)} 

                        sx={{mb:2}}
                    />
                    <TextField 
                        id="account" 
                        label="Bank Account" 
                        variant="standard" 
                        fullWidth
                        type='number'
                        value={account} 
                        onChange={(event) => setaccount(event.target.value)} 
                        sx={{mb:2}}
                    />
                    <TextField 
                        id="ifsc" 
                        label="IFSC Code" 
                        variant="standard" 
                        fullWidth
                        type='text'
                        value={ifsc} 
                        onChange={(event) => setifsc(event.target.value)} 
                        sx={{mb:2}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmit}>Add New</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const BankAccountAddCard = (props) => {
    const theme = useTheme();
    return (
        <Card sx={{ minWidth: 220, minHeight: 147, position: 'relative' }}>
            <CardContent sx={{ minHeight: 100 }}>
                <Box sx={{ position: 'absolute', right: theme.spacing(2), top: theme.spacing(2) }}>
                    {/* <Avatar variant='square' alt="Remy Sharp"  >
                        <AccountBalanceIcon />
                    </Avatar> */}
                    <AccountBalanceIcon fontSize='large' sx={{ width: 40, height: 40 }} />
                </Box>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Bank
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={props.onClickEvent}>Add Bank</Button>
            </CardActions>
        </Card>
    )
}