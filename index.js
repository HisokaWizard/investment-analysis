const express = require('express');
const { getMoexShare, getMoexHistoryShare } = require('./server/russianShares');
const { getForeignShare, getForeignHistoryShare } = require('./server/foreignShares');
const app = express();

const PORT = 9999;

const tickerMessage = {
  message: '400 Bad Request. You must send query param "ticker"',
};

const tickerAndPeridMessage = {
  message: '400 Bad Request. You must send query param "ticker" and "period"',
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
