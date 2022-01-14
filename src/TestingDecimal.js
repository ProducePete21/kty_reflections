import React from 'react';
import Big from 'big.js';

import { Grid,Typography } from '@mui/material';

const TestingDecimal = () => {
    let bigNum1 = new Big(1.254874657);
    let bigNum2 = new Big(2.485754249);

    let x = bigNum1.div(bigNum2);
    let y = x.div(bigNum1);
    let z = y.div(bigNum2);

    let num1 = 1.254874657;
    let num2 = 2.485754249;
    
    return(
        <Grid item style={{width: '300px'}} justifyContent='center'>
            <div style={{borderBottom: 'solid', borderBottomWidth: 'thin', borderRadius: '5px', borderColor: 'rgba(189, 195, 199)', height: '80px', backgroundColor: 'rgba(0, 0, 0, 0.08)', marginTop: '20px', paddingTop: '10px'}}>
                <Typography align='center' style={{marginTop: '10px'}}>
                    {console.log(z.toFixed(16))}
                </Typography>
                <Typography align='center' variant='subtitle2'>
                    {console.log(((num1/num2)/num1)/num2)}
                </Typography>
            </div>
        </Grid>
    )
}

export default TestingDecimal;