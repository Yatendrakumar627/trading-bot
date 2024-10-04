//import dependencies

require('dotenv').config(); 
const express = require('express');
const { simulateStockPrice } = require('./mockApi'); 
const { logTrade } = require('./utils'); 

const app = express();
let balance = 10000; 
let sharesOwned = 0; 
let previousPrice = 50; // Set an initial previous price for comparison
const tradeHistory = []; 

// Performance metrics
let totalTrades = 0; 
let totalProfitLoss = 0; 
let winningTrades = 0; 

// Function to execute trading logic based on simulated stock prices
const tradeStock = () => {
    const price = simulateStockPrice(); 
    console.log(`Current stock price: $${price}`);
    

    // Buy condition: Buy if the price drops by 2% from the previous price
    if (price < (previousPrice * 0.98) && balance >= price) {
        const sharesToBuy = Math.floor(balance / price);
        sharesOwned += sharesToBuy;
        balance -= sharesToBuy * price;
        logTrade(`Bought ${sharesToBuy} shares at $${price}`, tradeHistory);
        console.log(`Trade executed: Bought ${sharesToBuy} shares at $${price}`);
        console.log(`Current balance: $${balance.toFixed(2)}`);
        console.log(`Shares owned: ${sharesOwned}`);
        
        totalTrades++; 
    } 
    // Sell condition: Sell if the price rises by 3% from the previous price
    else if (price > (previousPrice * 1.03) && sharesOwned > 0) {
        const sellAmount = sharesOwned * price;
        totalProfitLoss += sellAmount - (sharesOwned * previousPrice);
        balance += sellAmount;
        logTrade(`Sold ${sharesOwned} shares at $${price}`, tradeHistory);
        console.log(`Trade executed: Sold ${sharesOwned} shares at $${price}`);
        console.log(`Current balance: $${balance.toFixed(2)}`);
        console.log(`Shares owned: ${sharesOwned}`);
        
       
        if (totalProfitLoss > 0) {
            winningTrades++;
        }

        sharesOwned = 0; 
        totalTrades++; 
    } else {
        console.log('No trade executed.');
    }
    
    // Update previous price for the next comparison
    previousPrice = price; 

    
    logPerformanceMetrics();
};

// Function to log performance metrics
const logPerformanceMetrics = () => {
    const winningPercentage = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    console.log(`Total Trades: ${totalTrades}`);
    console.log(`Total Profit/Loss: $${totalProfitLoss.toFixed(2)}`);
    console.log(`Winning Trades: ${winningTrades}`);
    console.log(`Winning Percentage: ${winningPercentage.toFixed(2)}%`);
};


const startTrading = () => {
    console.log('Starting trading bot...');
    setInterval(tradeStock, 5000); 
};

app.get('/', (req, res) => {
    res.send('Trading bot is running...');
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on http://localhost:3000');
    startTrading(); 
});