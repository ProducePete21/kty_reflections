<b>Krypto Kitty (KTY) Reflections Calculator</b>

Thanks for checking out my Krypto Kitty Reflections App!

I have written out all my thoughts about the app and what I'm trying to accomplish below. Please feel free to fork or clone this repository if you'd like to add anything to the project and submit pull requests. I have some ideas for cool things to add to it as time allows. If you have any problems with the app, or have any suggestions for app additions, please feel free to email me at KtyReflectionsApp@gmail.com.

If you do feel like contributing please only work off the Development Branch. I am relatively new to working with git and github for actual collaboration so I don't know the ins and outs of how it all works yet.

Also, if you do run this app on your local machine you will need a BSC scan API key for the API calls and will need to create a .env file with an environment variable named REACT_APP_BSC_KEY equal to your API key. Visit https://docs.bscscan.com/ for how to aquire an API key.

<br/>
<b>Reflections received for a chosen day:</b>

The main purpose of the app is to allow the user to select a specific date and then show the user what their reflections were for that day. The way I have it set up at the moment is while the main logic is running through all the transactions when it reaches a reflection eligible transaction it will create a Date object for the transaction and compare it to the date chosen on the calendar. All the eligible transactions that match the chosen date will be added to give the reflections for that day.

Currently the date is in UST but at some point I’d like to add time zones. 

<br/>
<b>Perceived Math for Reflections:</b>

The math that I have in my code is a guess on my part for how I believe reflections are being distributed.

I believe that the equation to determine a reflection for a particular transaction would be: 
(transactionValue * 0.03) * userOwnershipPercentage.

That’s 3% of whatever the amount of the transaction was times whatever the user’s personal percentage of ownership is at the time. The ownership percentage would just be the current amount of owned KTY divided by the current total supply.

The ownership percentage and the total supply change after every burn and every reflection eligible transaction. It would also change as user’s buy and sell KTY.

<br/>
<b>Total Supply:</b>

I discovered that the total supply that comes from BSC scan, if I were to use the API to pull it, is not accurate. The only way to find an accurate total supply is to consider literally every transaction since the coin’s inception, subtracting burns from the original total supply in order. We know the starting total supply so that’s not a problem. This also assures that when you get to a transaction where a reflection would take place you have exactly what the total supply was at that time of that transaction.

<br/>
<b>Owned KTY:</b>

As the calculateReflections function runs it will also pick up on transactions where a user received/sent or bought/sold KTY and adds or subtracts from the user’s total KTY owned respectively. Just like with total supply, as KTY is added or subtracted from a user’s wallet it’s going to change the reflections they receive.

<br/>


