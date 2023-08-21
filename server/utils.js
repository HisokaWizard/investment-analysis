///// RUSSIAN SHARES

// Сбербанк
// Лукойл
// Газпром
// Норильский никель
// Новатэк
// Yandex
// Роснефть
// Татнефть
// TCS Group
// Полюс
// Магнит
// МТС
// Сургутнефтегаз
// ФосАгро
// Северсталь
// ИнтерРао
// Алроса
// НЛМК
// Мечел
// Московская биржа
// X5 RetailGroup ГДР
// ПИК
// Банк ВТБ
// РУСАЛ
// Ozon
// ММК
// Транснефть
// Русгидро
// VK
// Ростелеком
// МКБ
// АФК Система
// En+ Group
// Fix Price
// GlobalTrans
// Русагро
// Аэрофлот
// Белуга Групп
// Газпромнефть
// Группа ЛСР
// Группа Черкизово
// Группа позитив
// МВидео
// Нижнекамскнефтехим ап
// Пермэнергосбыт
// Россети
// Qiwi
// Мать и дитя
// Селиград

const listOfRusTickers = [
  'SBER',
  'LKOH',
  'GAZP',
  'GMKN',
  'NVTK',
  'YNDX',
  'ROSN',
  'TATN',
  'TCSG',
  'PLZL',
  'MGNT',
  'MTSS',
  'SNGS',
  'PHOR',
  'CHMF',
  'IRAO',
  'ALRS',
  'NLMK',
  'MTLR',
  'MOEX',
  'FIVE',
  'PIKK',
  'VTBR',
  'RUAL',
  'OZON',
  'MAGN',
  'TRNFP',
  'HYDR',
  'VKCO',
  'RTKMP',
  'CBOM',
  'AFKS',
  'ENPG',
  'FIXP',
  'GLTR',
  'AGRO',
  'AFLT',
  'BELU',
  'SIBN',
  'LSRG',
  'GCHE',
  'POSI',
  'MVID',
  'NKNCP',
  'PMSBP',
  'FEES',
  'QIWI',
  'MDMG',
  'SGZH',
  'SELG',
];

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

const datePeriods = {
  week: 7 * millisecDayKoef,
  month: 30 * millisecDayKoef,
  quart: 90 * millisecDayKoef,
  half: 180 * millisecDayKoef,
  year: 365 * millisecDayKoef,
  year2: 730 * millisecDayKoef,
  year3: 1095 * millisecDayKoef,
};

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
  listOfRusTickers,
  datePeriods,
  ruslUrl,
  historicalRusUrl,
  foreignUrl,
  historicalForeignUrl,
  identifyCorrectDate,
  constructActualDate,
};
