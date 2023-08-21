const axios = require('axios');
const { constructActualDate, ruslUrl, historicalRusUrl } = require('./utils');

const getMoexShare = async (ticker) => {
  const formattedDate = constructActualDate(0);
  try {
    const response = await axios({
      method: 'get',
      url: ruslUrl(ticker),
    });
    const data = response?.data?.marketdata?.data;
    if (!data) return null;
    return { date: formattedDate, ticker, price: data?.[0]?.[11] ?? 0 };
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getMoexHistoryShare = async (ticker, period) => {
  const formattedDate = constructActualDate(period);
  try {
    const response = await axios({
      method: 'get',
      url: historicalRusUrl(ticker, formattedDate),
    });
    const data = response?.data?.history?.data;
    if (!data) return null;
    return { ticker: ticker, price: data?.[0]?.[11] ?? 0, date: formattedDate };
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  getMoexShare,
  getMoexHistoryShare,
};
