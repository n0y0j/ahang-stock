const puppeteer = require("puppeteer")
const cheerio = require("cheerio")

const getHistoricalData = async (ticker) => {
    
    let start = new Date();
    var historicalData = []

    const browser = await puppeteer.launch({
        headless: true
    })

    const page = await browser.newPage();
    await page.goto(`https://finance.yahoo.com/quote/${ticker}/history?p=${ticker}`)
    const content = await page.content();

    const $ = cheerio.load(content);
    const lists = $(`#Col1-1-HistoricalDataTable-Proxy > section > div`);
    const table = $(lists).find(`table > tbody > tr`);

    table.map((index, item) => {
        historicalData.push({
            date: $(item).find("td:nth-child(1)").text(),
            open: $(item).find("td:nth-child(2)").text(),
            high: $(item).find("td:nth-child(3)").text(),
            low: $(item).find("td:nth-child(4)").text(),
            close: $(item).find("td:nth-child(5)").text(),
            adj_close: $(item).find("td:nth-child(6)").text(),
            volume: $(item).find("td:nth-child(7)").text(),
        })
    })

    let end = new Date();
    console.log(historicalData);
    console.log(end - start)
};

getHistoricalData('TSLA');
