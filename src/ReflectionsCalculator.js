import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import DataTable, { defaultThemes } from 'react-data-table-component';

import { Grid, Typography, Card, Button, Fade } from '@mui/material';

import ReflectionsCalcInput from './ReflectionsCalcInput';
import Footer from './Footer';
import WarningDialogPopover from './WarningDialogPopover';
import IntroPopover from './IntroPopover';
import Loading from './Loading';

import 'react-datepicker/dist/react-datepicker.css';

const initialState = {
    personalKtyAddress: '',
    date: new Date(),
}

const columns = [
    {
        name: 'Date',
        selector: 'date',
        sortable: true
      },
      {
        name: 'Reflections For Day',
        selector: 'reflectionsForDay',
        sortable: true
      },
  ];

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
  };

const formatNumber = new Intl.NumberFormat('en-US');
const decimalConst = 0.000000001;
const timeStampConst = 1000;
let dates = [];
let dataTableArray = [];

const ReflectionsCalculator = () => {
    let allTrx = [];
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [dateRangeTimes, setDateRangeTimes] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const [trxData, setTrxData] = useState([]);
    const [trxData2, setTrxData2] = useState([]);
    const [trxData3, setTrxData3] = useState([]);
    const [trxDataLoaded, setTrxDataLoaded] = useState(false);
    const [totalDeadBurns, setTotalDeadBurns] = useState(0);
    const [fullTotalSupply, setFullTotalSupply] = useState(69420000000000);
    const [totalReflections, setTotalReflections] = useState(0);
    const [reflectionsForDate, setReflectionsForDate] = useState(0);
    const [currentTotalKTY, setCurrentTotalKTY] = useState();
    const [trxCount, setTrxCount] = useState(0);
    const [maxWidth, setMaxWidth] = useState('800px');
    const [fadeIn, setFadeIn] = useState(false);
    const [calcRunning, setCalcRunning] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showIntroDialog, setShowIntroDialog] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [loadButton, setLoadButton] = useState(true);
    const [warning, setWarning] = useState('');


    useEffect(() => {
        setShowIntroDialog(true);
        startDate.setHours(12, 0, 0);
    }, [])

    const loadData = () => {
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

                })
                .catch(error => console.log(error));

            // Third call to API for transactions after 20000
            await fetch(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x86296279c147bd40cbe5b353f83cea9e9cc9b7bb&startblock=15683013&endblock=99999999&sort=asc&apikey=${process.env.REACT_APP_BSC_KEY}`)
                .then(res => res.json())
                .then(data => {
                    data.result.shift();
                    setTrxData3(data.result);

                    setTrxDataLoaded(true);
                })
                .catch(error => console.log(error));

            // call to API to find a user KTY balance
            await fetch(`https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x86296279c147bd40cbe5b353f83cea9e9cc9b7bb&address=${formData.personalKtyAddress}&tag=latest&apikey=${process.env.REACT_APP_BSC_KEY}`)
                .then(res => res.json())
                .then(data => {
                    setCurrentTotalKTY((data.result * decimalConst).toFixed(9));
                })
                .catch(error => console.log(error));

            await fetch(`https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x86296279c147bd40cbe5b353f83cea9e9cc9b7bb&address=0x000000000000000000000000000000000000dead&tag=latest&apikey=${process.env.REACT_APP_BSC_KEY}`)
                .then(res => res.json())
                .then(data => {
                    setTotalDeadBurns((data.result * decimalConst).toFixed(9));
                })
                .catch(error => console.log(error));
        }

        fetchingData();
    }

    const handleChange = ({target}) => {
        setFormData({...formData, [target.name]: target.value})
    }

    // main logic for reflections
    const calculateReflections = (personalKtyAddress) => {
        console.log(dates);
        allTrx.push(trxData);
        allTrx.push(trxData2);
        allTrx.push(trxData3);
        let totalSupply = 69420000000000;
        let fullTotalSupply = 69420000000000;
        let ktyAddsAndSubs = 0;
        let personalKtyAmount = 0;
        let reflectionsForChosenDay = 0;
        let totalReflections = 0;
        // +1 every loop to assure that my logic is counting the correct number of transactions
        let trxCount = 0;
        dataTableArray = [];

        // iterates through each set of 10000 transactions in order
        allTrx.forEach(trxArray => {
            trxArray.forEach((trx, index) => {
                // Checks for trx sent the burn address and subtracts the value of that transaction from the total supply to be display   
                if(trx.to.startsWith('0x000000000000000000000000000') && trx.value !== 0) {
                    fullTotalSupply = fullTotalSupply - (trx.value * decimalConst);      
                } 
                // Checks for trx sent the burn address and subtracts the value of that transaction from the total supply to used for reflections math
                if(trx.to.startsWith('0x000000000000000000000000000') && trx.value !== 0 && !trx.to.endsWith('dead')) {
                        totalSupply = totalSupply - (trx.value * decimalConst);
                // Checks for trx sent to user's wallet (receiving or buying) and adds value to personalKtyAmount         
                } else if(trx.to.startsWith(personalKtyAddress.toLowerCase())) {
                        personalKtyAmount = personalKtyAmount + (trx.value * decimalConst);
                        ktyAddsAndSubs = ktyAddsAndSubs + (trx.value * decimalConst);
                // Check for trx sent from (sending or selling) user's wallet and subtracts value from personalKtyAmount
                } else if(trx.from.startsWith(personalKtyAddress.toLowerCase())) {
                        personalKtyAmount = personalKtyAmount - ((trx.value * decimalConst) / 0.96 );
                        ktyAddsAndSubs = ktyAddsAndSubs - ((trx.value * decimalConst) / 0.96 );
                // Checks for trx that is reflections eligible and runs reflections math
                } else if(trx.value !== 0 && !trx.to.startsWith('0x000000000000000000000') && !trx.from.startsWith('0x364c69b3da660d6e534a11dc77cd4d0d510179e1') && !trx.to.startsWith('0x364c69b3da660d6e534a11dc77cd4d0d510179e1')) {
                        const ownershipPercentage = personalKtyAmount / totalSupply;
                    
                        // 3.125% is used because the transaction value from bsc scan is 96% of the actual transaction amount. It's the amount transferred after the 4% burn and reflection tax.
                        const elementReflection = ((trx.value * decimalConst) * 0.03125) * ownershipPercentage;
                
                        personalKtyAmount = personalKtyAmount + elementReflection;
                        totalReflections = totalReflections + elementReflection;
                        
                        const elementDate = new Date(trx.timeStamp * timeStampConst);
                        const nextElementDate = index+1 < trxArray.length ? new Date(trxArray[index+1].timeStamp * timeStampConst) : elementDate;

                        if(dates.length > 0) {
                            for(let i=0; i<dates.length; i++) {
                                if(elementDate.getUTCMonth() === dates[i].getUTCMonth() && elementDate.getUTCDate() === dates[i].getUTCDate() && elementDate.getUTCFullYear() === dates[i].getUTCFullYear()) {
                                    reflectionsForChosenDay = reflectionsForChosenDay + elementReflection;
                                    
                                    if(dates[i].getUTCDate() !== nextElementDate.getUTCDate()) {
                                        const reflectionsObj = {
                                            date: `${dates[i].getUTCMonth()+1}/${dates[i].getUTCDate()}/${dates[i].getUTCFullYear()}`,
                                            reflectionsForDay: formatNumber.format(reflectionsForChosenDay.toFixed(2)),
                                        }

                                        dataTableArray.push(reflectionsObj);

                                        reflectionsForChosenDay = 0;
                                    }

                                    break;
                                }
                            }

                        } else {            
                            // compares trx date with user chosen date. If they match the trx's reflections are added to reflectionsForChosenDay 
                            if(elementDate.getUTCMonth() === startDate.getUTCMonth() && elementDate.getUTCDate() === startDate.getUTCDate() && elementDate.getUTCFullYear() === startDate.getUTCFullYear()) {
                                reflectionsForChosenDay = reflectionsForChosenDay + elementReflection;
                            }
                        }
                }
                trxCount++;
        })})
        
        setReflectionsForDate(formatNumber.format(reflectionsForChosenDay.toFixed(2)));
        setTotalReflections((parseFloat(currentTotalKTY) - ktyAddsAndSubs));
        setFullTotalSupply(formatNumber.format((totalSupply - totalDeadBurns).toFixed(2)));
        setTrxCount(formatNumber.format(trxCount));
        setShowResult(true);
        setFadeIn(true);
    }


    const handleButton = async () => {
        if(window.innerWidth < 400) {
            setMaxWidth('285px');
        }
        window.scrollTo({top: 600, behavior: 'smooth'})
        if(formData.personalKtyAddress === '') {
            setFadeIn(true);
        } else if (formData.personalKtyAddress === '0') {
            setFadeIn(true);
        } else if (!formData.personalKtyAddress.startsWith('0x')) {
            setFadeIn(true);
        } else {
            setCalcRunning(true);
            calculateReflections(formData.personalKtyAddress);  
        }   
    }

    const handleLoadButton = () => {
        if(formData.personalKtyAddress === '') {
            setWarning('Please enter a valid KTY address to load the data');
            setShowDialog(true);
        } else if (formData.personalKtyAddress === '0') {
            setWarning('Please enter a valid KTY address to load the data');
            setShowDialog(true);
        } else if (!formData.personalKtyAddress.startsWith('0x')) {
            setWarning('Please enter a valid KTY address to load the data');
            setShowDialog(true);
        } else {
            setLoadButton(false);
            //loadData();

            fetch('https://kty-backend.herokuapp.com/reflection/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    personalKtyAddress: formData.personalKtyAddress,
                    startDate: startDate,
                    endDate: endDate,
                    dates: dates,
                })
            })
            .then(res => res.json())
            .then(data => {
                setReflectionsForDate(data.reflectionsForDate);
                setTotalReflections(data.totalReflections);
                setCurrentTotalKTY(data.currentTotalKTY);
                setFullTotalSupply(data.fullTotalSupply);
                setTrxCount(data.trxCount);
                dataTableArray = data.dataTableArray;

                window.scrollTo({top: 600, behavior: 'smooth'})

                setShowResult(true);
                setFadeIn(true);
            })

            
        } 
        
    }

    const handleResultsButton = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        setFadeIn(false);
    }

    const handleDateChange = (dateRange) => {
        dates = [];
        const [start, end] = dateRange;
        if(end === null) {
            setFadeIn(false);
            window.scrollTo({top: 0, behavior: 'smooth'});
            start.setHours(12, 0, 0);
            setStartDate(start);
            setEndDate(end);
        } else {
            start.setHours(0, 0, 0);
            end.setHours(23, 59, 59);
            setDateRangeTimes([start.getTime(), end.getTime()])
            setFadeIn(false);
            window.scrollTo({top: 0, behavior: 'smooth'});
            start.setHours(12, 0, 0);
            setStartDate(start);
            setEndDate(end);
            allDates(start, end);
        }
    }

    const formattedDate = () => {
        const options = { month: 'short' };
        const monthName = new Intl.DateTimeFormat('en-US', options).format(startDate);
        return `${monthName} ${startDate.getDate()}, ${startDate.getFullYear()}`;
    }

    const closeDialog = () => {
        setShowDialog(false);
    }

    const closeIntroDialog = () => {
        setShowIntroDialog(false);
    }

    const allDates = (start, end) => {
        let startDate = new Date(start.getTime());
        const timeDifference = end.getTime() - start.getTime();
        const numberOfDays = Math.floor(timeDifference / (1000 * 3600 * 24)) + 1;

        for(let i=0; i<numberOfDays; i++) {
            const newDate = startDate.getTime() + (86400000 * i);
            dates.push(new Date(newDate)); 
        }

    } 
    
    // A Div for displaying result of calculation. A leftover from previous app, not sure If I'm going to use it in this app yet.
    const result = (
        <Grid container justifyContent='center'>
            <Card elevation={10} style={{padding: '20px', maxWidth: maxWidth}}>
                <Typography align='center'>
                    <h4 style={{marginTop: '0px'}}><b>Your Personal Reflections:</b></h4>
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Reflections for ${formattedDate()}: ${reflectionsForDate} KTY`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Total Received Reflections: ${formatNumber.format(totalReflections)} KTY`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Current Total KTY Balance: ${currentTotalKTY} KTY`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Current Total Supply: ${fullTotalSupply} KTY`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Total Transcations Considered: ${trxCount} Transactions`}
                </Typography>
                <Grid container justifyContent='center'>
                <Button variant='contained' onClick={handleResultsButton} style={{marginTop: '15px', backgroundColor: '#4B3F72'}}>Back To Top</Button>
                </Grid>
            </Card>
        </Grid>
    );

    const dateRangeResult = (
        <Grid container justifyContent='center'>
            <Card elevation={10} style={{padding: '20px', maxWidth: maxWidth}}>
                <DataTable 
                    title='Daily Reflections'
                    columns={columns}
                    data={dataTableArray}
                    striped
                    pagination
                    paginationRowsPerPageOptions={[10]}
                    paginationComponentOptions={{ noRowsPerPage: true }}
                    customStyles={customStyles}
                />
                <Typography align='center' gutterBottom style={{paddingTop: '15px'}}>
                    {`Total Received Reflections: ${formatNumber.format(totalReflections)} KTY`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Current Total KTY Balance: ${currentTotalKTY} KTY`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Current Total Supply: ${fullTotalSupply} KTY`}
                </Typography>
                <Typography align='center' gutterBottom>
                    {`Total Transcations Considered: ${trxCount} Transactions`}
                </Typography>
                <Grid container justifyContent='center'>
                <Button variant='contained' onClick={handleResultsButton} style={{marginTop: '15px', backgroundColor: '#4B3F72'}}>Back To Top</Button>
                </Grid>
            </Card>
        </Grid>
    )

    // A Div for displaying needed information if a user inputs wrong info. This is leftover from the previous AMP calc, not sure if I'll need this app yet.
    const notABscAddress = (
        <Grid container alignItems='center' justifyContent='center'>
            <Card elevation={10} style={{padding: '10px', maxWidth: maxWidth}}>
                <Grid container direction='column' alignItems='center'>
                    <Typography>
                        Something is not right here:
                    </Typography>
                    <Typography gutterBottom style={{paddingRight: '10px'}}>
                        <ul>
                            <li>Check that your KTY address is correct</li>
                            <li>KTY addresses start with '0x'</li>
                            <li>Fields can only contain numbers and letters</li>
                        </ul>
                    </Typography>
                    <Grid item>
                        <Button variant='contained' onClick={handleResultsButton} style={{marginTop: '15px', backgroundColor: '#4B3F72'}}>Back To Top</Button>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );

    return(
        <div>
            <div>
                <Grid container spacing={25} justifyContent='center' style={{flexWrap: 'nowrap', paddingTop: '50px'}}>
                    { window.innerWidth > 400 ?
                    <Grid item>
                        <img src='kitty-and-coin_modified.png' alt='kittyLogo' />
                    </Grid>
                    :
                    ''
                    }
                    <Grid item>
                        <Card elevation={10}>
                        <Grid container spacing={2} direction='column' alignItems='center' raised style={{padding: '16px', minWidth: '250px', maxWidth: (window.innerWidth < 400 ? '345px' : '645px'), marginLeft: '0px', marginTop: '0px', width: '100%' }}>
                            <Typography align='center' style={{margin: '10px'}}>Use this simple calculator to help determine your KTY reflections</Typography>
                            <Typography align='center' style={{marginTop: '10px', fontWeight: 'bold'}}>Enter your public KTY Address below:</Typography>
                            <ReflectionsCalcInput name='personalKtyAddress' id='personalKtyAddress' label='KTY address' autoFocus type='text' handleChange={handleChange} />
                            <Typography align='center' style={{marginTop: '30px', fontWeight: 'bold'}}>Select a date (or date range) from the calendar:</Typography>
                            <Grid item style={{marginTop: '10px', paddingLeft: '0px', paddingTop: '10px'}}>
                                <DatePicker 
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    minDate={new Date('November 06, 2021 12:00:00')}
                                    maxDate={new Date()}
                                    startDate={startDate}
                                    endDate={endDate}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode='select'
                                    selectsRange
                                    inline
                                />
                            </Grid>
                            <Grid container direction='column' alignItems='center'>
                                <Grid item>
                                    <Typography align='center' style={{marginTop: '20px', fontWeight: 'bold'}}>
                                        Click button below to show reflections:
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant='contained' onClick={handleLoadButton} style={{marginTop: '15px', backgroundColor: '#4B3F72'}}>Show Reflections</Button>
                                </Grid>
                            </Grid>
                            <Typography align='center' style={{paddingTop: '20px', marginTop: '10px'}}>KTY transaction data provided by {<a href='https://bscscan.com/token/0x86296279c147bd40cbe5b353f83cea9e9cc9b7bb' target='_blank' rel="noreferrer noopener">BSC Scan</a>}</Typography>
                        </Grid>
                        </Card>
                    </Grid>
                    { window.innerWidth > 400 ?
                    <Grid item>
                        <img src='kitty-and-coin_modified.png' alt='kittyLogo' />
                    </Grid>
                    :
                    ''
                    }
                </Grid>
            </div>
            {showResult ?
                <Fade in={fadeIn}>
                    <div style={{marginTop: '40px'}}>
                        {dates.length > 0 ?
                        dateRangeResult
                        :
                        result
                        }
                    </div>
                </Fade>
                :
                calcRunning ?
                <Fade in={fadeIn}>
                    <div style={{marginTop: '40px'}}>
                        <Grid container justifyContent='center'>
                            <Card elevation={10} style={{padding: '10px', maxWidth: '800px'}}>
                                <Typography align='center' gutterBottom>
                                        'CATculating Reflections...'
                                </Typography>
                            </Card>
                        </Grid>
                    </div>
                </Fade>
                :
                <Fade in={fadeIn}>
                    <div style={{marginTop: '40px'}}>
                        {notABscAddress}
                    </div>
                </Fade>
            }
            { window.innerWidth > 400 ?
            <div>
                <Footer />
            </div>
            :
            ''
            }  
            <WarningDialogPopover open={showDialog} onClose={closeDialog} warning={warning} />
            <IntroPopover open={showIntroDialog} onClose={closeIntroDialog} />
        </div>
    )
}

export default ReflectionsCalculator;