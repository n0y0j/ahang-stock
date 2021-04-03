# @ahang/stock

특정 미국 주식의 **주가 변동과 총수입(매출), 순이익, 분석가 분석** 데이터를 크롤링 해주는 패키지입니다.

개인 웹 프로젝트를 위해 제작된 패키지입니다.
<br />
<br />


![issue badge](https://img.shields.io/badge/puppeteer-8.0.0-red)   ![issue badge](https://img.shields.io/badge/cheerio-1.0.0-orange)
<br />
<br />


## Installation

```javascript
npm i @ahang/stock
```
<br />

## Usage

### `getHistoricalData()`

Type: `date, number`

특정 미국 주식의 **1년 간의 주가 변동 데이터**를 **json** 형식으로 리턴합니다.

```javascript
const stock = require('@ahang/stock')

const data = await stock.getHistoricalData('AAPL')
// [
//    {
//      date: 2021-03-31T00:00:00.000Z,
//      open: 121.650002,
//      high: 123.519997,
//      low: 121.150002,
//      close: 122.150002,
//      adj_close: 122.150002,
//      volume: 118323800
//    },
//    {
//      date: 2021-03-30T00:00:00.000Z,
//      open: 120.110001,
//      high: 120.400002,
//      low: 118.860001,
//      close: 119.900002,
//      adj_close: 119.900002,
//      volume: 85671900
//    },
//    ...
//    ...
// ]
```



***

### `getEarningData()`

Type: `number`

특정 미국 주식의 **현재부터 내년까지의 총수입(매출)  데이터**를 **json** 형식으로 리턴합니다.

```javascript
const stock = require('@ahang/stock')

const data = await stock.getEarningData('AAPL')
// {
//    currentYear: {                현재년도
//        numberOfAnalysts: 40,     참여한 분석가 수
//        average: 4.45,            평균 매출 예측
//        high: 4.1                 높은 매출 예측
//        low: 4.89                 낮은 매출 예측
//    },
//    nextYear: {                   내년
//        numberOfAnalysts: 39,     ...
//        average: 4.69,
//        high: 3.64,
//        low: 5.5
//    }
// }
```



***

### `getRevenueData()`

Type: `string, number`

특정 미국 주식의 **현재부터 내년까지의 순이익 분석 데이터**를 **json** 형식으로 리턴합니다.

```javascript
const stock = require('@ahang/stock')

const data = await stock.getRevenueData('AAPL')
// {
//    currentYear: {              현재년도
//      numberOfAnalysts: 36,     참여한 분석가 수
//      average: '333.48B',       평균 순이익 예측
//      high: '316.27B',          높은 순이익 예측
//      low: '343.55B',           낮은 순이익 예측
//      salesGrowth: '21.50%'     성장률 예측
//    },
//    nextYear: {                 내년
//      numberOfAnalysts: 35,     ... 
//      average: '347.92B',
//      high: '291.56B',
//      low: '386.5B',
//      salesGrowth: '4.30%'
//    }
// }
```



***

### `getPriceTargetData()`

Type: `number`

특정 미국 주식의 **분석가 분석 데이터**를 **json** 형식으로 리턴합니다.

```javascript
const stock = require('@ahang/stock')

const data = await stock.getRevenueData('AAPL')
// {
//    numberOfAnalysts: 26,   참여한 분석가 수
//    average: 151.83,        기업 평균 주가 예측
//    high: 175,              기업 높은 주가 예측
//    low: 80,                기업 낮은 주가 예측
//    buy: 20,                구매를 추천하는 분석가 수
//    hold: 4,                보류를 추천하는 분석가 수
//    sell: 2                 판매를 추천하는 분석가 수
// }
```

