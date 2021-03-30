const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
var fs = require('fs')

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

const getEarningData = async (ticker) => {
    const browser = await puppeteer.launch({
        headless: true
    })

    const page = await browser.newPage();
    await page.goto(`https://finance.yahoo.com/quote/${ticker}/analysis?p=${ticker}`)
    const content = await page.content();

    const $ = cheerio.load(content);
    const lists = $(`#Col1-0-AnalystLeafPage-Proxy > section`);
    const earningTable = $(lists).find(`table:nth-child(2) > tbody`);
    const revenueTable = $(lists).find(`table:nth-child(3) > tbody > tr:nth-child(6)`);

    earning = {
        currentYear: {
            numberOfAnalysts: parseInt($(earningTable).find("tr:nth-child(1) > td:nth-child(4)").text()),
            average: parseFloat($(earningTable).find("tr:nth-child(2) > td:nth-child(4)").text()),
            high: parseFloat($(earningTable).find("tr:nth-child(3) > td:nth-child(4)").text()),
            low: parseFloat($(earningTable).find("tr:nth-child(4) > td:nth-child(4)").text())
        },
        nextYear: {
            numberOfAnalysts: parseInt($(earningTable).find("tr:nth-child(1) > td:nth-child(5)").text()),
            average: parseFloat($(earningTable).find("tr:nth-child(2) > td:nth-child(5)").text()),
            high: parseFloat($(earningTable).find("tr:nth-child(3) > td:nth-child(5)").text()),
            low: parseFloat($(earningTable).find("tr:nth-child(4) > td:nth-child(5)").text())
        }
    }

    console.log(earning)
}

const getPriceTarget = async (ticker) => {
    const browser = await puppeteer.launch({
        headless: true
    })

    const page = await browser.newPage();
    await page.goto(`https://www.tipranks.com/stocks/${ticker}/forecast`)
    const content = await page.content();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36");
    
    const $ = cheerio.load(content);
    const lists = $(`div.client-components-stock-research-StockPageBox-style__box.stock-box-mobile-border-top-override.client-components-stock-research-analysts-style__priceTarget.client-components-stock-research-style__tabbedStockBox > div > p`);

    const priceTarget = {
        numberOfAnalysts: parseInt($(lists).find('strong:nth-child(1)').text().split(' ')[0]),
        average: parseFloat($(lists).find('strong:nth-child(3)').text().replace('$', "").replace(",", "")),
        high: parseFloat($(lists).find('strong:nth-child(4)').text().replace('$', "").replace(",", "")),
        low: parseFloat($(lists).find('strong:nth-child(5)').text().replace('$', "").replace(",", "")),
    }

    console.log(priceTarget)
}

getEarningData('AAPL')
