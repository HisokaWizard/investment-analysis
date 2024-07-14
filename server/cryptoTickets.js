// Base variables
const coinMarketCapTokens = [];
const shift = 2;
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Crypto');
const tokensColumn = 'A';
const maxTickPerWeek = 21;
const maxTickPerMonth = 90;

// Fill our tokens list
let loopIndex = 0;
while (true) {
  const tokenValue = sheet.getRange(tokensColumn + (shift + loopIndex)).getValue();
  if (tokenValue && tokenValue !== '') {
    coinMarketCapTokens.push(tokenValue);
    loopIndex++;
  } else {
    break;
  }
}
const tokensAmount = coinMarketCapTokens.length;

// Api url
const getFromCoinMarketCupUrl = (token) =>
  `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${token}&convert=USD`;

// Sheet variables
const currentPriceColumn = 'D';
const prevPriceColumn = 'E';
const dailyPriceChangesColumn = 'I';
const nominalColumn = 'G';
const progressColumn = 'H';
const weeklyPriceColumn = 'L';
const weeklyDifferenceColumn = 'M';
const monthlyPriceColumn = 'N';
const monthlyDifferenceColumn = 'O';
const myCoinMarketCupTokenValue = sheet.getRange('K3').getValue();
const myGmailValue = sheet.getRange('K5').getValue();
const triggerCell = sheet.getRange('K7');
const weeklyTickCell = sheet.getRange('K20');
const monthlyTickCell = sheet.getRange('K26');
const triggerValue = +triggerCell.getValue();
const myInputValue = +sheet.getRange('K9').getValue();
const myOutputValue = +sheet.getRange('K10').getValue();
const progressCoefValue = +sheet.getRange('K12').getValue();
const weeklyTickCount = +sheet.getRange('K20').getValue();
const monthlyTickCount = +sheet.getRange('K26').getValue();

// Business logic functions
const recieveCryptoPairsPriceCoinMarketCup = (token, index) => {
  const url = getFromCoinMarketCupUrl(token);
  const cell = sheet.getRange(currentPriceColumn + index);
  try {
    Utilities.sleep(100 * index);
    const response = UrlFetchApp.fetch(url, {
      headers: { 'X-CMC_PRO_API_KEY': myCoinMarketCupTokenValue },
    }).getContentText();
    const result = JSON.parse(response);
    const value = result.data[token].quote.USD.price;
    console.log(token, ': ', value);
    cell.setValue(value);
  } catch (error) {
    console.log(error);
  }
};

const writePreviousTokenPrice = () => {
  for (let index = 0; index < tokensAmount; index++) {
    const actualPriceCell = sheet.getRange(currentPriceColumn + (index + shift));
    const prevPriceCell = sheet.getRange(prevPriceColumn + (index + shift));
    prevPriceCell.setValue(actualPriceCell.getValue());
  }
};

const countingDailyDifference = () => {
  const changes = [];
  for (let index = 0; index < tokensAmount; index++) {
    const actualPriceCell = sheet.getRange(currentPriceColumn + (index + shift));
    const prevPriceCell = sheet.getRange(prevPriceColumn + (index + shift));
    const chagedCell = sheet.getRange(dailyPriceChangesColumn + (index + shift));
    const result = +actualPriceCell.getValue() / +prevPriceCell.getValue() - 1;
    changes.push(result);
    chagedCell.setValue(result);
  }
  const trigger = changes.filter(
    (it) => +it > progressCoefValue / 100 || +it < -progressCoefValue / 100,
  );
  if (trigger.length > 0) {
    const emailBody = coinMarketCapTokens
      .map((it, index) => `${it}: ${changes[index]}`)
      .join(';\n');
    MailApp.sendEmail({ to: myGmailValue, subject: 'Huge crypto progress', body: emailBody });
  }
};

const prepareDailyReport = () => {
  if (+triggerCell.getValue() !== 3) return;
  //
  const reportData = [];
  for (let index = 0; index < tokensAmount; index++) {
    const nominal = Number(sheet.getRange(nominalColumn + (index + shift)).getValue()).toFixed(4);
    const progress = Number(sheet.getRange(progressColumn + (index + shift)).getValue()).toFixed(4);
    reportData.push(`[${coinMarketCapTokens[index]}: ${nominal}$ / ${progress}%]`);
  }
  const totalProgressPercent = myOutputValue / myInputValue - 1;
  const totalProgressAmount = myOutputValue - myInputValue;
  const reportStringData = reportData.join('\n');
  const result =
    reportStringData +
    '\n\n' +
    `My total progress, RUB: ${totalProgressAmount.toFixed(4)}` +
    '\n' +
    `My total progress, %: ${totalProgressPercent.toFixed(4)}`;

  MailApp.sendEmail({ to: myGmailValue, subject: 'Daily Report', body: result });
  triggerCell.setValue(0);
};

const updateWeeklyTokenPrices = () => {
  if (+weeklyTickCount !== maxTickPerWeek) {
    const count = +weeklyTickCount + 1;
    weeklyTickCell.setValue(count);
    return;
  }
  //
  const weekResult = [];
  for (let index = 0; index < tokensAmount; index++) {
    const tokenCell = sheet.getRange(tokensColumn + (index + shift));
    const weeklyDifferenceCell = sheet.getRange(weeklyDifferenceColumn + (index + shift));
    weekResult.push(`${tokenCell.getValue()}: ${weeklyDifferenceCell.getValue()}`);
  }
  const result = 'WEEKLY DIFFERENCE: \n' + weekResult.join('\n');
  MailApp.sendEmail({ to: myGmailValue, subject: 'Weekly Report', body: result });
  //
  for (let index = 0; index < tokensAmount; index++) {
    const actualPriceCell = sheet.getRange(currentPriceColumn + (index + shift));
    const weekAgoPriceCell = sheet.getRange(weeklyPriceColumn + (index + shift));
    weekAgoPriceCell.setValue(actualPriceCell.getValue());
  }
  weeklyTickCell.setValue(0);
};

const updateMonthlyTokenPrices = () => {
  if (+monthlyTickCount !== maxTickPerMonth) {
    const count = +monthlyTickCount + 1;
    monthlyTickCell.setValue(count);
    return;
  }
  //
  const monthResult = [];
  for (let index = 0; index < tokensAmount; index++) {
    const tokenCell = sheet.getRange(tokensColumn + (index + shift));
    const monthlyDifferenceCell = sheet.getRange(monthlyDifferenceColumn + (index + shift));
    monthResult.push(`${tokenCell.getValue()}: ${monthlyDifferenceCell.getValue()}`);
  }
  const result = 'MONTHLY DIFFERENCE: \n' + monthResult.join('\n');
  MailApp.sendEmail({ to: myGmailValue, subject: 'Monthly Report', body: result });
  //
  for (let index = 0; index < tokensAmount; index++) {
    const actualPriceCell = sheet.getRange(currentPriceColumn + (index + shift));
    const monthAgoPriceCell = sheet.getRange(monthlyPriceColumn + (index + shift));
    monthAgoPriceCell.setValue(actualPriceCell.getValue());
  }
  monthlyTickCell.setValue(0);
};

// Running main functions
const getAllCryptoTokens = () => {
  triggerCell.setValue(+triggerCell.getValue() + 1);

  writePreviousTokenPrice();
  coinMarketCapTokens.forEach((it, index) => {
    recieveCryptoPairsPriceCoinMarketCup(it, index + shift);
  });
  countingDailyDifference();
  updateWeeklyTokenPrices();
  updateMonthlyTokenPrices();
  prepareDailyReport();
};

function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('Crypto')
    .addItem('GetActualTokenPrices', 'getAllCryptoTokens')
    .addToUi();
}
