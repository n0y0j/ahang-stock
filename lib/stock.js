const cheerio = require("cheerio");
const { getBrowserContent } = require("./browser");
const { getCrumb, download } = require("./crumb");

const getHistoricalData = async (ticker) => {
  var historicalData = [];

  var now = parseInt(Date.now() / 1000);
  var a_year_ago = now - 31536000;

  const HISTORY_URL = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}`;

  const crumb = await getCrumb(ticker);
  const tempData = await download(
    HISTORY_URL,
    {
      period1: a_year_ago,
      period2: now,
      interval: "1d",
      events: "history",
      crumb: crumb,
    },
    { resolveWithFullResponse: true }
  );

  const tempDataList = tempData.body.split("\n");

  tempDataList.slice(1).map((item, index) => {
    const dataList = item.split(",");

    historicalData.push({
      date: new Date(dataList[0]),
      open: parseFloat(dataList[1]),
      high: parseFloat(dataList[2]),
      low: parseFloat(dataList[3]),
      close: parseFloat(dataList[4]),
      adj_close: parseFloat(dataList[5]),
      volume: parseInt(dataList[6]),
    });
  });

  return historicalData;
};

const getEarningData = async (ticker) => {
  const content = await getBrowserContent("analysis", ticker);

  const $ = cheerio.load(content);
  const lists = $(`#Col1-0-AnalystLeafPage-Proxy > section`);
  const earningTable = $(lists).find(`table:nth-child(2) > tbody`);

  const earning = {
    currentYear: {
      numberOfAnalysts: parseInt(
        $(earningTable).find("tr:nth-child(1) > td:nth-child(4)").text()
      ),
      average: parseFloat(
        $(earningTable).find("tr:nth-child(2) > td:nth-child(4)").text()
      ),
      high: parseFloat(
        $(earningTable).find("tr:nth-child(3) > td:nth-child(4)").text()
      ),
      low: parseFloat(
        $(earningTable).find("tr:nth-child(4) > td:nth-child(4)").text()
      ),
    },
    nextYear: {
      numberOfAnalysts: parseInt(
        $(earningTable).find("tr:nth-child(1) > td:nth-child(5)").text()
      ),
      average: parseFloat(
        $(earningTable).find("tr:nth-child(2) > td:nth-child(5)").text()
      ),
      high: parseFloat(
        $(earningTable).find("tr:nth-child(3) > td:nth-child(5)").text()
      ),
      low: parseFloat(
        $(earningTable).find("tr:nth-child(4) > td:nth-child(5)").text()
      ),
    },
  };

  return earning;
};

const getRevenueData = async (ticker) => {
  const content = await getBrowserContent("analysis", ticker);

  const $ = cheerio.load(content);
  const lists = $(`#Col1-0-AnalystLeafPage-Proxy > section`);
  const revenueTable = $(lists).find(`table:nth-child(3) > tbody`);

  const revenue = {
    currentYear: {
      numberOfAnalysts: parseInt(
        $(revenueTable).find("tr:nth-child(1) > td:nth-child(4)").text()
      ),
      average: $(revenueTable).find("tr:nth-child(2) > td:nth-child(4)").text(),
      high: $(revenueTable).find("tr:nth-child(3) > td:nth-child(4)").text(),
      low: $(revenueTable).find("tr:nth-child(4) > td:nth-child(4)").text(),
      salesGrowth: $(revenueTable)
        .find("tr:nth-child(6) > td:nth-child(4)")
        .text(),
    },
    nextYear: {
      numberOfAnalysts: parseInt(
        $(revenueTable).find("tr:nth-child(1) > td:nth-child(5)").text()
      ),
      average: $(revenueTable).find("tr:nth-child(2) > td:nth-child(5)").text(),
      high: $(revenueTable).find("tr:nth-child(3) > td:nth-child(5)").text(),
      low: $(revenueTable).find("tr:nth-child(4) > td:nth-child(5)").text(),
      salesGrowth: $(revenueTable)
        .find("tr:nth-child(6) > td:nth-child(5)")
        .text(),
    },
  };

  return revenue;
};

const getPriceTargetData = async (ticker) => {
  const content = await getBrowserContent("pricetarget", ticker);

  const $ = cheerio.load(content);
  const lists = $(
    `div.client-components-stock-research-StockPageBox-style__box.stock-box-mobile-border-top-override.client-components-stock-research-analysts-style__priceTarget.client-components-stock-research-style__tabbedStockBox > div > p`
  );
  const ModerateLists = $(
    `div.client-components-pie-style__legendaryPie.client-components-stock-research-analysts-analyst-consensus-style__legendaryPie > div > ul`
  );

  const priceTarget = {
    numberOfAnalysts: parseInt(
      $(lists).find("strong:nth-child(1)").text().split(" ")[0]
    ),
    average: parseFloat(
      $(lists)
        .find("strong:nth-child(3)")
        .text()
        .replace("$", "")
        .replace(",", "")
    ),
    high: parseFloat(
      $(lists)
        .find("strong:nth-child(4)")
        .text()
        .replace("$", "")
        .replace(",", "")
    ),
    low: parseFloat(
      $(lists)
        .find("strong:nth-child(5)")
        .text()
        .replace("$", "")
        .replace(",", "")
    ),
    buy: parseInt(
      $(ModerateLists).find("li:nth-child(1) > span:nth-child(2) > b").text()
    ),
    hold: parseInt(
      $(ModerateLists).find("li:nth-child(2) > span:nth-child(2) > b").text()
    ),
    sell: parseInt(
      $(ModerateLists).find("li:nth-child(3) > span:nth-child(2) > b").text()
    ),
  };

  console.log(priceTarget);

  return priceTarget;
};

module.exports = {
  getHistoricalData,
  getEarningData,
  getRevenueData,
  getPriceTargetData,
};
