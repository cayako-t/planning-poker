import { Typography, CircularProgress } from '@mui/material';
import React from 'react';

const Loading = () => {

    return(
        <div style={{margin: 'auto', width:'max-content', marginTop:'30vh'}}>
            <Typography style={{fontSize:'3em'}}><span style={{marginRight:'20px'}}>Loading</span><CircularProgress /></Typography>
        </div>
    )
}

export default Loading;