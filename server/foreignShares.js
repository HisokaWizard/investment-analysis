const axios = require('axios');
const { foreignUrl, identifyCorrectDate, historicalForeignUrl } = require('./utils');

const getForeignShare = async (ticker) => {
  try {
    const response = await axios({
      method: 'get',
      url: foreignUrl(ticker),
    });
    const data = response?.data;
    if (!data) return null;
    return {
      ticker,
      price: data?.['Global Quote']?.['05. price'],
      date: data?.['Global Quote']?.['07. latest trading day'],
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getForeignHistoryShare = async (ticker, period) => {
  const date = identifyCorrectDate(period);
  try {
    const response = await axios({
      method: 'get',
      url: historicalForeignUrl(ticker),
    });
    const data = response?.data;
    if (!data) return null;
    const price = data?.['Weekly Adjusted Time Series']?.[date]?.['4. close'];
    return { ticker, price, date };
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  getForeignShare,
  getForeignHistoryShare,
};
