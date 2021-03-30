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

const getAnalysisData = async (ticker) => {
    const browser = await puppeteer.launch({
        headless: true
    })

    const page = await browser.newPage();
    await page.goto(`https://finance.yahoo.com/quote/${ticker}/analysis?p=${ticker}`)
    const content = await page.content();

    const $ = cheerio.load(content);
    const lists = $(`#Col1-0-AnalystLeafPage-Proxy > section`);
    const earningTable = $(lists).find(`table:nth-child(2) > tbody > tr:nth-child(5)`);
    const revenueTable = $(lists).find(`table:nth-child(3) > tbody > tr:nth-child(6)`);

    const temp = $('script:not([src])');

    console.log(temp[38].children[0].data)
    
    // var file = 'text.txt';
    // fs.open(file,'w',function(err,fd){ if (err) throw err; console.log('file open complete'); });

    fs.writeFile('text.txt', temp[38].children[0].data, 'utf8', function(error) {
        console.log("write end")
    })

    // console.log(recoRating)
    // earningTable.map((index, item) => {
    //     console.log($(item).find("td:nth-child(2)").text())
    //     console.log($(item).find("td:nth-child(3)").text())
    //     console.log($(item).find("td:nth-child(4)").text())
    //     console.log($(item).find("td:nth-child(5)").text())
    // })

    // revenueTable.map((index, item) => {
    //     console.log($(item).find("td:nth-child(2)").text())
    //     console.log($(item).find("td:nth-child(3)").text())
    //     console.log($(item).find("td:nth-child(4)").text())
    //     console.log($(item).find("td:nth-child(5)").text())
    // })
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

getPriceTarget('GOOG')
