const puppeteer = require("puppeteer");

const getBrowserContent = async (type, ticker) => {
  const HISTORY_URL = `https://finance.yahoo.com/quote/${ticker}/history?p=${ticker}`;
  const ANALYSIS_URL = `https://finance.yahoo.com/quote/${ticker}/analysis?p=${ticker}`;
  const PRICETARGET_URL = `https://www.tipranks.com/stocks/${ticker}/forecast`;

  const browser = await puppeteer.launch({
    headless: true,
  });

  const userAgent = await browser.userAgent();

  var url = ``;

  switch (type) {
    case "history":
      url = HISTORY_URL;
      break;
    case "analysis":
      url = ANALYSIS_URL;
      break;
    case "pricetarget":
      url = PRICETARGET_URL;
      break;
  }

  const page = await browser.newPage();
  await page.setUserAgent(userAgent);
  await page.goto(url);

  return await page.content();
};

module.exports = { getBrowserContent };