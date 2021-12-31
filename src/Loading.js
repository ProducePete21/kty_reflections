import React from 'react';

import { Grid, LinearProgress, CircularProgress } from '@mui/material';

const Loading = ({name, id, handleChange, label, value, autoFocus, dollarSign, type}) => {
    return(
        <Grid item style={{width: '300px'}}>
            <div style={{borderBottom: 'solid', borderBottomWidth: 'thin', borderRadius: '5px', borderColor: 'rgba(189, 195, 199, 0.9)', height: '54px', backgroundColor: 'rgba(0, 0, 0, 0.08)'}}>
                <LinearProgress style={{top: '25px', left: '8px', width: '95%'}}/>
            </div>
        </Grid>
    )
}

export default Loading;