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
import FileUpload from './FileUpload';


export default function DialogUpload(props) {
    const [open, setOpen] = useState(false);


    const handleClickOpen = () => {
        setOpen(true);
        console.log(props)
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div>
            <Button size="small" onClick={handleClickOpen}>Add Transactions</Button>
            <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth >
                <DialogTitle>Upload Transactions</DialogTitle>
                <DialogContent>
                    <FileUpload server={`http://localhost:8000/upload_bank_transactions?bank=${props.bank}&account=${props.account}`} title='bank transactions' allowMultiple={false} maxFiles={1} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
