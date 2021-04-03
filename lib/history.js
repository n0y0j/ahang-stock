const https = require("https")

const historyMarket = async (ticker) => {

    var now = parseInt(Date.now() / 1000)
    var a_year_ago = now - 31536000

    const HISTORY_URL = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${a_year_ago}&period2=${now}&interval=1d&events=history&includeAdjustedClose=true`

    return new Promise ((resolve, reject) => {
        let req = https.get(HISTORY_URL, function(res) {
            var data = ''
            res.on('data', function (chunk) {
                data += chunk
            })
            
            res.on('end', function () {
                var temp = data.split('\n')
                temp.shift()
                resolve(temp)
            })
    
            res.on('error', function (err) {
                console.log("hi");
            })
        })
    })
        
}

module.exports = {
    historyMarket
}