///// RUSSIAN SHARES
const ruslUrl = (ticker) =>
  `https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/${ticker}.json`;

const historicalRusUrl = (ticker, date) =>
  `https://iss.moex.com/iss/history/engines/stock/markets/shares/boardgroups/57/securities/${ticker}.jsonp?from=${date}&till=${date}`;

///// FOREIGN SAHRES
const alphaVantageKey = 'C1D9VXYNHSMZOLWQ';
const foreignUrl = (ticker) =>
  `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${alphaVantageKey}`;

const historicalForeignUrl = (ticker) =>
  `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${ticker}&apikey=${alphaVantageKey}`;

////// CONST TO COUNT AND TRANSFER

const millisecDayKoef = 24 * 60 * 60 * 1000;

////// FUNCTIONS

const constructActualDate = (period) => {
  let pastDate = Date.now() - period;
  let date = new Date(pastDate);
  const weekDay = date.getDay();
  if (weekDay === 0) {
    pastDate = pastDate - 2 * millisecDayKoef;
  }
  if (weekDay === 6) {
    pastDate = pastDate - millisecDayKoef;
  }
  date = new Date(pastDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

const identifyCorrectDate = (period) => {
  let date = new Date(Date.now() - period);
  let weekDay = date.getDay();
  let count = 0;
  if (weekDay > 5) {
    count = 1;
  }
  if (weekDay < 5) {
    count = 2 + weekDay;
  }
  date = new Date(Date.now() - period - count * millisecDayKoef);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

module.exports = {
  ruslUrl,
  historicalRusUrl,
  foreignUrl,
  historicalForeignUrl,
  identifyCorrectDate,
  constructActualDate,
};
