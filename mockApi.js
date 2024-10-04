const simulateStockPrice = () => {
  // Generate a random stock price between $30 and $70
  return (Math.random() * (70 - 30) + 30).toFixed(2);
};

module.exports = { simulateStockPrice };