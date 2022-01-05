<b>Krypto Kitty (KTY) Reflections Calculator</b>

Thanks for checking out my Krypto Kitty Reflections App!

The app is in development and does not calculate accurate reflections at the moment.

I have written out all my thoughts about the app and what I'm trying to accomplish below. This includes the issues I'm currently having with the calculations. Please feel free to fork or clone this repository if you'd like to help try and solve these problems. I'm just focused on getting the app to pop out the right numbers at the moment so any ideas for additions to the app will need to wait for now.

If you do feel like contributing please only work off the Development Branch. I am relatively new to working with git and github for actual collaboration so I don't know the ins and outs of how it all works yet.

Also, if you do run this app on your local machine you will need a BSC scan API key for the API calls and will need to create a .env file with an environment variable named REACT_APP_BSC_KEY equal to your API key. Visit https://docs.bscscan.com/ for how to aquire an API key.

<br/>
<b>Reflections received for a chosen day:</b>

The main purpose of the app is to allow the user to select a specific date and then show the user what their reflections were for that day. The way I have it set up at the moment is while the main logic is running through all the transactions when it reaches a reflection eligible transaction it will create a Date object for the transaction and compare it to the chosen date. All the eligible transactions that match the chosen date will be added to give the reflections for that day.

I will be adding a calendar to select dates once I know the reflections math is worked out. I have the Date object set to Dec. 25th at the moment because it was a day I was able to accurately calculate my reflections. The Date object is part of the formData object and can be changed manually in the ReflectionsCalculator.js component.

Currently the date is in UST but at some point I’d like to add time zones. 

<br/>
<b>Perceived Math for Reflections:</b>

The math that I have in my code is a guess on my part for how I believe reflections are being distributed.

I believe that the equation to determine a reflection for a particular transaction would be: 
(transactionValue * 0.03) * userOwnershipPercentage.

That’s 3% of whatever the amount of the transaction was times whatever the user’s personal percentage of ownership is at the time. The ownership percentage would just be the current amount of owned KTY divided by the current total supply.

The ownership percentage and the total supply change after every burn and every reflection eligible transaction. It would also change as user’s buy and sell KTY.

I don't have any code for handling when someone sells KTY yet, only for when someone buys KTY.

<br/>
<b>Total Supply:</b>

I discovered that the total supply that comes from BSC scan, if I were to use the API to pull it, is not accurate. The only way to find an accurate total supply is to consider literally every transaction since the coin’s inception, subtracting burns from the original total supply in order. We know the starting total supply so that’s not a problem. This also assures that when you get to a transaction where a reflection would take place you have exactly what the total supply was at that time of that transaction.

<br/>
<b>Owned KTY:</b>

As the calculateReflections function runs it will also pick up on transactions where a user received/sent or bought/sold KTY and adds or subtracts from the user’s total KTY owned respectively. Just like with total supply, as KTY is added or subtracted from a user’s wallet it’s going to change the reflections they receive.

Again though, there is no code yet for KTY sold or sent yet.

<br/>
<b>Current issues:</b>

<ul>
<li>
Each call to the BSC scan API is limited to 10000 transactions and KTY has more than 10000 transactions now. A second call will need to be made to get transactions after the first 10000. I haven’t figured out a way yet to make a second call starting at the last transaction of the first call. This will be an unsustainable way to do this as KTY becomes more popular but what’s important at the moment is to get the math working and then later ways can be found to reduce the amount of API calls being made.
  <ul>
  <li>
  I do have this working at the moment though the way I solved it is verbose and not the most efficient way of doing it. It also won't work after we're passed 20000 transactions unless I add a third API call manually. I have ideas for simplifying this process but if someone comes up with a better way to do it first feel free to write it and submit a pull request. 
  <li>
  </ul>
</li>
  
<li>
I have my logic currently adding all reflections and showing the resulting total owned KTY after all transactions to ensure that the math is right. However, when I use my personal KTY address I’m not getting the correct total. Theoretically, after all transactions, the KTY that my app produces should be equal to what I’m seeing in my wallet. The app says I’ve received roughly 0.004% more than I’ve actually received. That may not seem like a lot but for a user with a large bag considering their reflections over a year’s time, it will be a lot when converted to USD (or whatever a user’s local currency). So I’m not quite sure where I’m going wrong at the moment as my logic seems sound.
<ul>
  <li>
  Considering that the app is giving a number for reflections that’s more than what I’ve actually received, there are a few options for what may be happening:
  <ol>
    <li>
    I'm taking 3% of the value of the transaction showing on BSC scan as the basis for determining the total reflection to be distributed. I'm not sure if the 3% should considered on the amount BSC scan is showing, or if the burn (which is recorded on BSC scan prior to the trx I'm considering) needs to be added back into the transaction before calculating the 3%. Either way I do the app gives me a larger number than what I'm actually receiving in reflections so it's possible that:
    </li>
    <li>
    I'm misunderstanding, and thereby miscalculating, how the percentage of ownership determined reflections. If I am calculating a larger ownership % than I actually have I'm going to get a larger number back for personal reflections.
    </li>
    <li>
    Neither the burn value nor the trx value showing on bsc scan is accurate to what numbers are used to calculate reflections
    </li>
  </ol>
  </li>
  <li>
  There is the possibility that I’m considering the burns and reflections in the wrong order. I.e. Currently the logic counts the burn first and then distributes the reflection. The numbers would calculate differently if the reflection was distributed first and then burn happened. To do the latter would require very different logic since currently it just goes in order of how transactions are recorded on BSC Scan.
  </li>
</ul>
</li>
</ul>
