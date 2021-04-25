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

const getProxyData = async () => {

  try {
    const browser = await puppeteer.launch({args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']})

    const temp = await browser.userAgent();
    const userAgent = temp.replace('Headless', '')
  
    let page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.goto('https://spys.one/free-proxy-list/KR/')

    const proxies = await page.evaluate(() => {
      const ips = Array.from(document.querySelectorAll('tr > td:first-of-type > .spy14')).map( (v) => v.textContent.replace(/document\.write\(.+\)/, ''))
      const types = Array.from(document.querySelectorAll('tr > td:nth-of-type(2)')).slice(5).map( (v) => v.textContent)
      const anoymities = Array.from(document.querySelectorAll('tr > td:nth-of-type(3)')).slice(4).map( (v) => v.textContent)
      const latencies = Array.from(document.querySelectorAll('tr > td:nth-of-type(6) > .spy1')).map( (v) => v.textContent)
      return ips.map( (v,i) => {
        return {
          ip: v,
          type: types[i],
          anoymity: anoymities[i], 
          latency: latencies[i],
        }
      })
    })

    let tempData = proxies.filter((v) => v.type.startsWith('HTTP')).sort((a, b) => b.latency - a.latency)
    const data = tempData.slice(tempData.length - 10)

    await browser.close()
    return data
  } catch (e) {
    console.log(e)
  }
}

module.exports = { getBrowserContent, getProxyData };
