const puppeteer = require("puppeteer");

const getBrowserContent = async (type, ticker) => {
  const ANALYSIS_URL = `https://finance.yahoo.com/quote/${ticker}/analysis?p=${ticker}`;
  const PRICETARGET_URL = `https://www.tipranks.com/stocks/${ticker}/forecast`;

  const browser = await puppeteer.launch({
    headless: true,
  });

  const userAgent = await browser.userAgent();

  var url = ``;

  switch (type) {
    case "analysis":
      url = ANALYSIS_URL;
      break;
    case "pricetarget":
      url = PRICETARGET_URL;
      break;
  }

  const page = await browser.newPage();
  await page.setUserAgent(userAgent);
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url);

  const content = await page.content()
  await browser.close();
  return content
};

module.exports = { getBrowserContent };
