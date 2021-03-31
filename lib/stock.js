const cheerio = require("cheerio")
const { getBrowserContent } = require("./browser")

const getHistoricalData = async (ticker) => {
    var historicalData = []

    const content = await getBrowserContent('history', ticker)

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

    return historicalData
};

const getEarningData = async (ticker) => {

    const content = await getBrowserContent('analysis', ticker)

    const $ = cheerio.load(content);
    const lists = $(`#Col1-0-AnalystLeafPage-Proxy > section`);
    const earningTable = $(lists).find(`table:nth-child(2) > tbody`);

    const earning = {
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

    return earning
}

const getRevenueData = async (ticker) => {

    const content = await getBrowserContent('analysis', ticker)

    const $ = cheerio.load(content);
    const lists = $(`#Col1-0-AnalystLeafPage-Proxy > section`);
    const revenueTable = $(lists).find(`table:nth-child(3) > tbody`);

    const revenue = {
        currentYear: {
            numberOfAnalysts: parseInt($(revenueTable).find("tr:nth-child(1) > td:nth-child(4)").text()),
            average: $(revenueTable).find("tr:nth-child(2) > td:nth-child(4)").text(),
            high: $(revenueTable).find("tr:nth-child(3) > td:nth-child(4)").text(),
            low: $(revenueTable).find("tr:nth-child(4) > td:nth-child(4)").text(),
            salesGrowth: $(revenueTable).find("tr:nth-child(6) > td:nth-child(4)").text(),
        },
        nextYear: {
            numberOfAnalysts: parseInt($(revenueTable).find("tr:nth-child(1) > td:nth-child(5)").text()),
            average: $(revenueTable).find("tr:nth-child(2) > td:nth-child(5)").text(),
            high: $(revenueTable).find("tr:nth-child(3) > td:nth-child(5)").text(),
            low: $(revenueTable).find("tr:nth-child(4) > td:nth-child(5)").text(),
            salesGrowth: $(revenueTable).find("tr:nth-child(6) > td:nth-child(5)").text(),
        }
    }

    return revenue
}

const getPriceTargetData = async (ticker) => {

    const content = await getBrowserContent('pricetarget', ticker)
    
    const $ = cheerio.load(content);
    const lists = $(`div.client-components-stock-research-StockPageBox-style__box.stock-box-mobile-border-top-override.client-components-stock-research-analysts-style__priceTarget.client-components-stock-research-style__tabbedStockBox > div > p`);
    const ModerateLists = $(`div.client-components-pie-style__legendaryPie.client-components-stock-research-analysts-analyst-consensus-style__legendaryPie > div > ul`)

    const priceTarget = {
        numberOfAnalysts: parseInt($(lists).find('strong:nth-child(1)').text().split(' ')[0]),
        average: parseFloat($(lists).find('strong:nth-child(3)').text().replace('$', "").replace(",", "")),
        high: parseFloat($(lists).find('strong:nth-child(4)').text().replace('$', "").replace(",", "")),
        low: parseFloat($(lists).find('strong:nth-child(5)').text().replace('$', "").replace(",", "")),
        buy: parseInt($(ModerateLists).find('li:nth-child(1) > span:nth-child(2) > b').text()),
        hold: parseInt($(ModerateLists).find('li:nth-child(2) > span:nth-child(2) > b').text()),
        sell: parseInt($(ModerateLists).find('li:nth-child(3) > span:nth-child(2) > b').text()),
    }

    return priceTarget
}

module.exports = {
    getHistoricalData, getEarningData, getRevenueData, getPriceTargetData
}