var {
  getHistoricalData,
  getEarningData,
  getRevenueData,
  getPriceTargetData,
} = require("./lib/stock");

getHistoricalData('TSLA');

module.exports = {
  getHistoricalData: async (ticker) => {
    return await getHistoricalData(ticker);
  },
  getEarningData: async (ticker) => {
    return await getEarningData(ticker);
  },
  getRevenueData: async (ticker) => {
    return await getRevenueData(ticker);
  },
  getPriceTargetData: async (ticker) => {
    return await getPriceTargetData(ticker);
  },
};
