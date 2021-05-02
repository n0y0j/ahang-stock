var request = require("request-promise");
var _ = require("lodash");
var tough = require("tough-cookie");

var Cookie = tough.Cookie;
var crumb = null;
var rpOpts = { resolveWithFullResponse: true };
var dataRE = /^root.App.main = (\{.*\});$/m;

var cookiejar = new request.jar();
const HISTORICAL_CRUMB_URL = `https://finance.yahoo.com/quote/$TIKR/history`;

const getCrumb = (ticker) => {
  if (crumb) {
    var cookies = cookiejar.getCookies(HISTORICAL_CRUMB_URL);
    var bCookie = _.find(cookies, { key: "B" });

    if (!bCookie) crumb = null;
  }

  if (crumb) {
    return Promise.resolve(crumb);
  } else {
    return fetch(ticker).then(function (crumb) {
      return crumb;
    });
  }
};

const fetch = (ticker) => {
  var url = HISTORICAL_CRUMB_URL.replace(/\$TIKR/, ticker);

  return download(url, "", rpOpts).then(function (res) {
    crumb = parseAndGetCrumb(res.body);
    return crumb;
  });
};

const download = (uri, qs, optionalHttpRequestOptions) => {
  var finalHttpRequestOptions = augmentHttpRequestOptions(
    optionalHttpRequestOptions
  );

  return request(_.extend({ uri: uri, qs: qs }, finalHttpRequestOptions)).then(
    function (res) {
      storeCookiesInJar(res.headers["set-cookie"], uri, cookiejar);
      return optionalHttpRequestOptions &&
        optionalHttpRequestOptions.resolveWithFullResponse
        ? res
        : res.body;
    }
  );
};

const parseAndGetCrumb = (body) => {
  var match = dataRE.exec(body);

  var data;
  try {
    data = JSON.parse(match[1]);
  } catch (err) {
    console.error(err);
  }

  var crumb;

  var dispatcher = data.context.dispatcher;
  crumb =
    dispatcher &&
    dispatcher.stores &&
    dispatcher.stores.CrumbStore &&
    dispatcher.stores.CrumbStore.crumb;

  if (!crumb) {
    var plugins = data.context.plugins;
    crumb =
      plugins &&
      plugins.ServicePlugin &&
      plugins.ServicePlugin.xhrContext &&
      plugins.ServicePlugin.xhrContext.crumb;
  }

  return crumb;
};

function augmentHttpRequestOptions(optionalOptions) {
  // 3 개의 json을 merge, 필드 값이 같다면 가장 오른쪽에 있는 값으로 변경
  return _.assign({}, optionalOptions, {
    resolveWithFullResponse: true,
    jar: cookiejar,
  });
}

function storeCookiesInJar(setCookieHeader, url, cookiejar) {
  var cookies;

  if (typeof setCookieHeader === "undefined") {
  } else if (setCookieHeader instanceof Array) {
    cookies = setCookieHeader.map(Cookie.parse);
  } else if (typeof setCookieHeader === "string") {
    cookies = [Cookie.parse(setCookieHeader)];
  }

  if (cookies)
    for (var i = 0; i < cookies.length; i++) {
      cookiejar.setCookie("" + cookies[i], url);
    }
}

module.exports = { getCrumb, download };
