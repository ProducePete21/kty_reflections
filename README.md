<b>Math for Reflections:</b>

I believe that the equation to determine a reflection for a particular transaction would be: 
(transactionValue * 0.03) * userOwnershipPercentage.

That’s 3% of whatever the amount of the transaction was times whatever the user’s personal percentage of ownership is. The ownership percentage would just be the current amount of owned KTY divided by the current total supply.

The ownership percentage and the total supply change after every burn and every reflection eligible transaction. It would also change as user’s buy and sell KTY.

<b>Total Supply:</b>

I discovered that the total supply that comes from BSC scan, if I were to use the API to pull it, is not accurate. The only way to find an accurate total supply is to consider literally every transaction since the coin’s inception, subtracting burns from the original total supply in order. We know the starting total supply so that’s not a problem. This also assures that when you get to a transaction where a reflection would take place you have exactly what the total supply was at that time of that transaction.

<b>Owned KTY:</b>

As the calculateReflections function runs it will also pick up on transactions where a user received/sent or bought/sold KTY and adds or subtracts from the user’s total KTY owned respectively. Just like with total supply, as KTY is added or subtracted from a user’s wallet it’s going to change the reflections they receive.

<b>Reflections received for a chosen day:</b>

The main purpose of the app is to allow the user to select a specific date and then show the user what their reflections were for that day. The way I have it set up at the moment is while the main logic is running through all the transactions when it reaches a reflection eligible transaction it will create a Date object for the transaction and compare it to the chosen date. All the eligible transactions that match will be added to give the reflections for that day.

Currently the date is UST but at some point I’d like to add time zones. That’s for later though. 

<b>Current issues:</b>

<ul>
<li>
Each call to the BSC scan API is limited to 10000 transactions and KTY has more than 10000 transactions now. A second call will need to be made to get transactions after the first 10000. I haven’t figured out a way yet to make a second call starting at the last transaction of the first call. This will be an unsustainable way to do this as KTY becomes more popular but what’s important at the moment is to get the math working and then later ways can be found to reduce the amount of API calls being made.
</li>
  
<li>
I have my logic currently adding all reflections and showing the resulting total owned KTY after all transactions to ensure that the math is right. However, when I use my personal KTY address I’m not getting the correct total. Theoretically, after all transactions, the KTY that my app produces should be equal to what I’m seeing in my wallet. The app says I’ve received 0.004% less than I’ve actually received. That may not seem like a lot but for a user with a large bag considering their reflections over a year’s time, it will be a lot when converted to USD (or whatever a user’s local currency). So I’m not quite sure where I’m going wrong at the moment as my logic seems sound,
<ul>
  <li>
  Considering that the app is giving a number that’s less than what I’ve actually received, I’m thinking that I’m missing transactions somewhere along the line that should be considered for reflections. Haven’t figured out a way to find which transactions yet though.
  </li>
  <li>
  There is the possibility that I’m considering the burns and reflections in the wrong order. I.e. Currently the logic counts the burn first and then distributes the reflection. The numbers would calculate differently if the reflection was distributed first and then burn happened. To do the latter would require very different logic since currently it just goes in order of how transactions are recorded on BSC Scan.
  </li>
</ul>
</li>
</ul>
