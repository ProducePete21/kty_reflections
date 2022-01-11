import React from 'react';

import { Grid, TextField } from '@mui/material';

const ReflectionsCalcInput = ({name, id, handleChange, label, value, autoFocus, type}) => {
    return(
        <Grid item style={{width: '300px', paddingLeft: '0px', paddingTop: '10px'}}>
            <TextField 
                name={name}
                id={id}
                onChange={handleChange}
                variant='outlined'
                fullWidth
                label={label}
                autoFocus={autoFocus}
                type={type}
                required
            />
        </Grid>
    )
}

export default ReflectionsCalcInput