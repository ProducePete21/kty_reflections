import React from 'react';

import { Grid, LinearProgress, CircularProgress, Typography } from '@mui/material';

const Loading = ({name, id, handleChange, label, value, autoFocus, dollarSign, type}) => {
    return(
        <Grid item style={{width: '300px'}}>
            <div style={{borderBottom: 'solid', borderBottomWidth: 'thin', borderRadius: '5px', borderColor: 'rgba(189, 195, 199, 0.9)', height: '80px', backgroundColor: 'rgba(0, 0, 0, 0.08)', marginTop: '20px', paddingTop: '10px'}}>
                <LinearProgress style={{left: '8px', width: '95%', paddingBottom: '10px'}}/>
                <Typography align='center' style={{marginTop: '10px'}}>
                    Waiting for data to load!
                </Typography>
                <Typography align='center' variant='subtitle2'>
                    (Be Patient! It's a lot of info!)
                </Typography>
            </div>
        </Grid>
    )
}

export default Loading;