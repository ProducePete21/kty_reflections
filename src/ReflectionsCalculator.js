import React, { useState, useEffect } from 'react';

import { Grid, Typography, Card, Button, Fade } from '@mui/material';

import AmpCalcInput from './ReflectionsCalcInput';
import AmpCalcAutoFill from './ReflectionsCalcAutoFill';
import Footer from './Footer';
import WarningDialogPopover from './WarningDialogPopover';
import Loading from './Loading';

const initialState = {
    personalKtyAddress: '',
    date: new Date('December 25, 2021 00:00:01'),
}

const dateNow = new Date();
const decimalConst = 0.000000001;
const timeStampConst = 1000;

const ReflectionsCalculator = () => {
    const [formData, setFormData] = useState(initialState);
    const [trxData, setTrxData] = useState(null);
    const [trxDataLoaded, setTrxDataLoaded] = useState(false);
    const [totalSupply, setTotalSupply] = useState(69420000000000);
    const [totalReflections, setTotalReflections] = useState(0);
    const [reflectionsForDate, setReflectionsForDate] = useState(0);
    const [currentTotalKTY, setCurrentTotalKTY] = useState(0);
    const [fadeIn, setFadeIn] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showResult, setShowResult] = useState(true);
    const [warning, setWarning] = useState('');


    useEffect(() => {
        const fetchingData = async () => {
            try {
                fetch(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x86296279c147bd40cbe5b353f83cea9e9cc9b7bb&page=1&sort=asc&apikey=${process.env.REACT_APP_BSC_KEY}`)
                .then(res => res.json())
                .then(data => {
                    setTrxData(data);
                    setTrxDataLoaded(true);
                })
                .catch(error => console.log(error));
            } catch(error) {
                console.log(error)
            }
        }

        fetchingData();
    }, [])

    const handleChange = ({target}) => {
        setFormData({...formData, [target.name]: target.value})

        if(target.value === '') {
            setShowResult(false);
        } else if (parseFloat(target.value) === 0) {
            setShowResult(false);
        } else if (isNaN(parseFloat(target.value))) {
            setShowResult(false);
        } else {
            setShowResult(true);
        }

        console.log(formData);
    }

    const calculateReflections = (personalKtyAddress) => {
        let totalSupply = 69420000000000;
        let personalKtyAmount = 0;
        let reflectionsForDesiredDay = 0;

        trxData.result.forEach(el => {
          if(el.to.startsWith('0x000000000000000000000000000') && el.value !== 0) {
                totalSupply = totalSupply - (el.value * decimalConst);
          } else if(el.to.startsWith(personalKtyAddress.toLowerCase())) {
                personalKtyAmount = personalKtyAmount + (el.value * decimalConst);
                console.log(`KTY: ${personalKtyAmount.toFixed(9)}`);
                console.log(`Timestamp: ${el.timeStamp}`);
          } else if(el.value !== 0 && !el.to.startsWith('0x000000000000000000000') && !el.from.startsWith('0x364c69b3da660d6e534a11dc77cd4d0d510179e1') && !el.to.startsWith('0x364c69b3da660d6e534a11dc77cd4d0d510179e1')) {
                const ownershipPercentage = personalKtyAmount / totalSupply;
        
                console.log(`Total Supply: ${totalSupply.toFixed(9)}`);
                console.log(`% owned: ${ownershipPercentage.toFixed(9)}`);
        
                const elementReflection = ((el.value * decimalConst) * 0.03) * ownershipPercentage;
        
                // console.log(`Reflection: ${elementReflection}`);
        
                personalKtyAmount = personalKtyAmount + elementReflection;
        
                // console.log(`KTY after: ${personalKtyAmount}`);
        
                /* reflectionsForDesiredDay = reflectionsForDesiredDay + elementReflection; */
                
                const elementDate = new Date(el.timeStamp * timeStampConst);
        
                if(elementDate.getUTCMonth() === formData.date.getUTCMonth() && elementDate.getUTCDate() === formData.date.getUTCDate() && elementDate.getUTCFullYear() === formData.date.getUTCFullYear()) {
                    reflectionsForDesiredDay = reflectionsForDesiredDay + elementReflection;
                }
          }
        })
        
        console.log(`Reflections for Day: ${reflectionsForDesiredDay.toFixed(9)}`);
        console.log(`Current KTY: ${personalKtyAmount.toFixed(9)}`);
    }

    const handleButton = () => {
        calculateReflections(formData.personalKtyAddress)

        // setWarning(`The Button doesn't do anything yet!`);
        // setShowDialog(true);
        
    }

    const closeDialog = () => {
        setShowDialog(false);
    }

    // const result = (
    //     <Grid container justifyContent='center'>
    //         <Card elevation={10} style={{padding: '10px', maxWidth: '800px'}}>
    //             <Typography align='center' gutterBottom>
    //                 {`If you were to stake ${formData.totalAmp} AMP right now, it will take about ${howLong()} for your rewards to recoup the cost of staking`}
    //             </Typography>
    //             <Typography align='center' gutterBottom>
    //                 {`Note: This is based on the current AMP price of $${currentAmpPrice}. The price per AMP is always changing which will affect how quickly the fees are recouped`}
    //             </Typography>
    //         </Card>
    //     </Grid>
    // );

    const notABscAddress = (
        <Grid container justifyContent='center'>
            <Card elevation={10} style={{padding: '10px', maxWidth: '800px'}}>
                <Typography>
                    Check your entered values:
                </Typography>
                <Typography gutterBottom style={{paddingRight: '10px'}}>
                    <ul>
                        <li>All fields are required</li>
                        <li>None of the fields can equal 0</li>
                        <li>Fields can only contain numbers</li>
                    </ul>
                </Typography>
                {/* <Typography align='center' gutterBottom>
                    None of the fields can equal 0
                </Typography>
                <Typography align='center'>
                    Fields can only contain numbers
                </Typography> */}
            </Card>
        </Grid>
    );

    return(
        <div>
            <div>
                <Grid container spacing={25} justifyContent='center' style={{flexWrap: 'nowrap', paddingTop: '50px'}}>
                    <Grid item>
                        <img src='kitty-and-coin_modified.png' alt='kittyLogo' />
                    </Grid>
                    <Grid item>
                        <Card elevation={10}>
                        <Grid container spacing={2} direction='column' alignItems='center' raised style={{padding: '16px', minWidth: '250px', maxWidth: '645px', marginLeft: '0px', marginTop: '0px', width: '100%' }}>
                            <Typography align='center' style={{margin: '10px'}}>Use this simple calculator to help determine your KTY reflections</Typography>
                            <AmpCalcInput name='personalKtyAddress' id='personalKtyAddress' label='KTY address' autoFocus type='text' handleChange={handleChange} />
                            <AmpCalcInput name='date' id='date' label='Calender Placeholder Field' type='text' handleChange={handleChange} />
                            { trxDataLoaded ?
                                <AmpCalcAutoFill name='ktyReflectionForDate' id='ktyReflectionForDate' label='KTY Received on Selected date' type='text' value={reflectionsForDate} handleChange={handleChange} />
                                :
                                <Loading />
                            }
                            { trxDataLoaded ?
                                <AmpCalcAutoFill name='totalReflections' id='totalReflections' label='Total Reflections Received' type='text' value={totalReflections} handleChange={handleChange} />
                                :
                                <Loading />
                            }
                            { trxDataLoaded ?
                                <AmpCalcAutoFill name='currentTotalKTY' id='currentTotalKTY' label='Current Total KTY Owned' value={currentTotalKTY} type='text' handleChange={handleChange} />
                                :
                                <Loading />
                            }
                            { trxDataLoaded ?
                                <AmpCalcAutoFill name='currentTotalSupply' id='currentTotalSupply' label='Current Total Supply' value={totalSupply} type='text' handleChange={handleChange} />
                                :
                                <Loading />
                            }
                            <Button variant='contained' onClick={handleButton} style={{marginTop: '15px', backgroundColor: '#4B3F72'}}>Show Reflections</Button>
                            <Typography align='center' style={{paddingTop: '20px'}}>KTY transaction data provided by {<a href='https://bscscan.com/token/0x86296279c147bd40cbe5b353f83cea9e9cc9b7bb' target='_blank' rel="noreferrer noopener">BSC Scan</a>}</Typography>
                        </Grid>
                        </Card>
                    </Grid>
                    <Grid item>
                        <img src='kitty-and-coin_modified.png' alt='kittyLogo' />
                    </Grid>
                </Grid>
            </div>
            {/* { showResult ? 
            <div style={{marginTop: '40px'}}>
                <Fade in={fadeIn}>{result}</Fade>
            </div>
            :
            <div style={{marginTop: '40px'}}>
                <Fade in={fadeIn}>{notANumber}</Fade>
            </div>
            } */}
            <div>
                <Footer />
            </div>
            <WarningDialogPopover open={showDialog} onClose={closeDialog} warning={warning} />
        </div>
    )
}

export default ReflectionsCalculator;