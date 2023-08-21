const express = require('express');
const {
  getMoexShare,
  getMoexHistoryShare,
  getAllMoexShares,
  getAllMoexHistoryShares,
} = require('./server/russianShares');
const { getForeignShare, getForeignHistoryShare } = require('./server/foreignShares');
const { datePeriods } = require('./server/utils');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 9999;

const tickerMessage = {
  message: '400 Bad Request. You must send query param "ticker"',
};

const tickerAndPeridMessage = {
  message: '400 Bad Request. You must send query param "ticker" and "period"',
};

const errorHandler = (err) => {
  if (err) {
    console.error(err);
  }
};

app.get('/ru_shares', async (req, res) => {
  if (!req.query?.ticker) {
    return res.status(400).send(tickerMessage);
  }
  const result = await getMoexShare(req.query.ticker);
  res.send(result);
});

app.get('/ru_shares_history', async (req, res) => {
  if (!req.query?.ticker || !req.query?.period) {
    return res.status(400).send(tickerAndPeridMessage);
  }
  const result = await getMoexHistoryShare(req.query.ticker, req.query.period);
  res.send(result);
});

app.get('/all_current_ru_shares', async (req, res) => {
  const currentRusPrices = [];
  await getAllMoexShares(0, currentRusPrices);
  const resultData = currentRusPrices.map((it) => String(it.price).replace('.', ',')).join('\r\n');
  try {
    await fs.writeFile(
      path.join(__dirname, 'results', 'rus_current.txt'),
      resultData,
      errorHandler,
    );
  } catch (error) {
    console.error(error);
  }
  res.send(resultData);
});

app.get('/all_history_ru_shares', async (req, res) => {
  const keys = ['week', 'month', 'quart', 'half', 'year'];
  const historyRusData = {
    week: [],
    month: [],
    quart: [],
    half: [],
    year: [],
  };
  await getAllMoexHistoryShares(datePeriods.week, 0, 'week', historyRusData);
  await getAllMoexHistoryShares(datePeriods.month, 0, 'month', historyRusData);
  await getAllMoexHistoryShares(datePeriods.quart, 0, 'quart', historyRusData);
  await getAllMoexHistoryShares(datePeriods.half, 0, 'half', historyRusData);
  await getAllMoexHistoryShares(datePeriods.year, 0, 'year', historyRusData);
  for (let i = 0; i < keys.length; i++) {
    try {
      await fs.writeFile(
        path.join(__dirname, 'results', `rus_history_${keys[i]}.txt`),
        historyRusData?.[keys[i]]?.map((it) => String(it.price).replace('.', ',')).join('\r\n'),
        errorHandler,
      );
    } catch (error) {
      console.error(error);
    }
  }
  res.send(historyRusData);
});

app.get('/foreign_shares', async (req, res) => {
  if (!req.query?.ticker) {
    return res.status(400).send(tickerMessage);
  }
  const result = await getForeignShare(req.query.ticker);
  res.send(result);
});

app.get('/foreign_shares_history', async (req, res) => {
  if (!req.query?.ticker || !req.query?.period) {
    return res.status(400).send(tickerAndPeridMessage);
  }
  const result = await getForeignHistoryShare(req.query.ticker, req.query.period);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
