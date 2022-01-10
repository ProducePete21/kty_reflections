import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

import { Grid, Typography, Card, Button, Fade } from '@mui/material';

import ReflectionsCalcInput from './ReflectionsCalcInput';
import Footer from './Footer';
import WarningDialogPopover from './WarningDialogPopover';
import Loading from './Loading';

import 'react-datepicker/dist/react-datepicker.css';

const initialState = {
    personalKtyAddress: '',
    date: new Date('December 25, 2021 00:00:01'),
}

const decimalConst = 0.000000001;
const timeStampConst = 1000;

const ReflectionsCalculator = () => {
    const [formData, setFormData] = useState(initialState);
    const [trxData, setTrxData] = useState([]);
    const [trxData2, setTrxData2] = useState([]);
    let allTrx = [];
    const [trxDataLoaded, setTrxDataLoaded] = useState(false);
    const [totalSupply, setTotalSupply] = useState(69420000000000);
    const [totalReflections, setTotalReflections] = useState(0);
    const [reflectionsForDate, setReflectionsForDate] = useState(0);
    const [currentTotalKTY, setCurrentTotalKTY] = useState(0);
    const [trxCount, setTrxCount] = useState(0);
    const [fadeIn, setFadeIn] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [warning, setWarning] = useState('');


    useEffect(() => {
        let blockNum;
        // pulls all transaction info about KTY from BSC Scan
        const fetchingData = async () => {
            await fetch(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x86296279c147bd40cbe5b353f83cea9e9cc9b7bb&startblock=0&sort=asc&apikey=${process.env.REACT_APP_BSC_KEY}`)
                .then(res => res.json())
                .then(data => {
                    setTrxData(data.result);
                    // will be used for the subsequent calls to API as a starting transaction
                    blockNum = data.result[9999].blockNumber;
                })
                .catch(error => console.log(error));

            // second call to API for transactions after the first 10000. This is a temp solution as it's little verbose and will not work once trx 
            // are more than 20000 
            await fetch(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x86296279c147bd40cbe5b353f83cea9e9cc9b7bb&startblock=13836929&endblock=99999999&sort=asc&apikey=${process.env.REACT_APP_BSC_KEY}`)
                .then(res => res.json())
                .then(data => {
                    setTrxData2(data.result);

                    setTrxDataLoaded(true);
                })
                .catch(error => console.log(error));
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

    // main logic for reflections
    const calculateReflections = (personalKtyAddress) => {
        allTrx.push(trxData);
        allTrx.push(trxData2);
        let totalSupply = 69420000000000;
        let personalKtyAmount = 0;
        let reflectionsForChosenDay = 0;
        let totalReflections = 0;
        // +1 every loop to assure that my logic is counting the correct number of transactions
        let trxCount = 0;

        // iterates through each set of 10000 transactions in order
        allTrx.forEach(trxArray => {
            trxArray.forEach(trx => {
                // Checks for trx sent the burn address and subtracts the value of that transaction from the total supply   
                if(trx.to.startsWith('0x000000000000000000000000000') && trx.value !== 0 && !trx.to.endsWith('dead')) {
                        totalSupply = totalSupply - (trx.value * decimalConst);
                // Checks for trx sent to user's wallet (receiving or buying) and adds value to personalKtyAmount         
                } else if(trx.to.startsWith(personalKtyAddress.toLowerCase())) {
                        personalKtyAmount = personalKtyAmount + (trx.value * decimalConst);
                        console.log(`KTY after receiving : ${personalKtyAmount.toFixed(2)}`);
                        console.log(`Timestamp: ${trx.timeStamp}`);
                // Check for trx sent from (sending or selling) user's wallet and subtracts value from personalKtyAmount
                } else if(trx.from.startsWith(personalKtyAddress.toLowerCase())) {
                        personalKtyAmount = personalKtyAmount - (trx.value * decimalConst);
                        console.log(`KTY after sending: ${personalKtyAmount.toFixed(2)}`);
                        console.log(`Timestamp: ${trx.timeStamp}`);
                // Checks for trx sent from user's wallet subtract value from personalKtyAmount 
                } else if(trx.from.startsWith(personalKtyAddress.toLowerCase())) {
                        personalKtyAmount = personalKtyAmount - (trx.value * decimalConst);
                        console.log(`KTY: ${personalKtyAmount.toFixed(2)}`);
                        console.log(`Timestamp: ${trx.timeStamp}`);
                // Checks for trx that is reflections eligible and runs reflections math
                } else if(trx.value !== 0 && !trx.to.startsWith('0x000000000000000000000') && !trx.from.startsWith('0x364c69b3da660d6e534a11dc77cd4d0d510179e1') && !trx.to.startsWith('0x364c69b3da660d6e534a11dc77cd4d0d510179e1')) {
                        const ownershipPercentage = personalKtyAmount / totalSupply;
                
                        console.log(`Total Supply: ${totalSupply.toFixed(2)}`);
                        console.log(`% owned: ${ownershipPercentage.toFixed(5)}`);
                    
                        // 3.125% is used because the transaction value from bsc scan is 96% of the actual transaction amount. It's the amount transferred after the 4% burn and reflection tax.
                        const elementReflection = ((trx.value * decimalConst) * 0.03125) * ownershipPercentage;
                
                        personalKtyAmount = personalKtyAmount + elementReflection;
                        totalReflections = totalReflections + elementReflection;
                        
                        const elementDate = new Date(trx.timeStamp * timeStampConst);

                        // compares trx date with user chosen date. If they match the trx's reflections are added to reflectionsForChosenDay 
                        if(elementDate.getUTCMonth() === formData.date.getUTCMonth() && elementDate.getUTCDate() === formData.date.getUTCDate() && elementDate.getUTCFullYear() === formData.date.getUTCFullYear()) {
                            reflectionsForChosenDay = reflectionsForChosenDay + elementReflection;
                        }
                }
                trxCount++;
        })})
        
        const formatNumber = new Intl.NumberFormat('en-US');
        setReflectionsForDate(formatNumber.format(reflectionsForChosenDay.toFixed(2)));
        setTotalReflections(formatNumber.format(totalReflections.toFixed(2)));
        setCurrentTotalKTY(formatNumber.format(personalKtyAmount.toFixed(2)));
        setTotalSupply(formatNumber.format(totalSupply));
        setTrxCount(formatNumber.format(trxCount));
        setShowResult(true);
        setFadeIn(true);
    }

    const handleButton = () => {
        calculateReflections(formData.personalKtyAddress);     
    }

    const handleDateChange = (date) => {
        setFormData({...formData, date: date})
    }

    const formattedDate = () => {
        const options = { month: 'short' };
        const monthName = new Intl.DateTimeFormat('en-US', options).format(formData.date);
        return `${monthName} ${formData.date.getDay()}, ${formData.date.getFullYear()}`;
    }

    const closeDialog = () => {
        setShowDialog(false);
    }
    
    // A Div for displaying result of calculation. A leftover from previous app, not sure If I'm going to use it in this app yet.
    const result = (
        <Grid container justifyContent='center'>
            <Card elevation={10} style={{padding: '10px', maxWidth: '800px'}}>
                <Typography align='center' gutterBottom>
                    {`Reflections for ${formattedDate()}: ${reflectionsForDate}`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Total Received Reflections: ${totalReflections}`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Current KTY: ${currentTotalKTY}`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Current Total Supply: ${totalSupply}`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Total Transcation considered: ${trxCount}`}
                </Typography>
            </Card>
        </Grid>
    );

    // A Div for displaying needed information if a user inputs wrong info. This is leftover from the previous AMP calc, not sure if I'll need this app yet.
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
                            <ReflectionsCalcInput name='personalKtyAddress' id='personalKtyAddress' label='KTY address' autoFocus type='text' handleChange={handleChange} />
                            <DatePicker 
                                selected={formData.date}
                                onChange={date => handleDateChange(date)}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode='select'
                            />
                            { trxDataLoaded ?
                                <div>
                                <Typography align='center' style={{marginTop: '10px'}}>
                                    Data loaded
                                </Typography>
                                <Button variant='contained' onClick={handleButton} style={{marginTop: '15px', backgroundColor: '#4B3F72'}}>Show Reflections</Button>
                                </div>
                                :
                                <Typography align='center' style={{marginTop: '10px'}}>
                                    Waiting for data to load!
                                </Typography>
                            }
                            <Typography align='center' style={{paddingTop: '20px'}}>KTY transaction data provided by {<a href='https://bscscan.com/token/0x86296279c147bd40cbe5b353f83cea9e9cc9b7bb' target='_blank' rel="noreferrer noopener">BSC Scan</a>}</Typography>
                        </Grid>
                        </Card>
                    </Grid>
                    <Grid item>
                        <img src='kitty-and-coin_modified.png' alt='kittyLogo' />
                    </Grid>
                </Grid>
            </div>
            { showResult ? 
            <div style={{marginTop: '40px'}}>
                <Fade in={fadeIn}>{result}</Fade>
            </div>
            :
            <div style={{marginTop: '40px'}}>
                <Fade in={fadeIn}>{notABscAddress}</Fade>
            </div>
            }
            <div>
                <Footer />
            </div>
            <WarningDialogPopover open={showDialog} onClose={closeDialog} warning={warning} />
        </div>
    )
}

export default ReflectionsCalculator;