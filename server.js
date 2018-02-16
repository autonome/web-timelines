// server.js
// where your node app starts

/*
// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
*/

/*

  Get spec history (urls and dates) from latest w3c spec.

  let url = 'https://www.w3.org/TR/css-grid-1/';
  w3c(url)

  [
    { date: "2017-11-01", url: "https://www.w3.org/TR/css-grid-1/" }
    ...
  ]

*/
function w3c(url) {
  return new Promise(function(resolve, reject) {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    JSDOM.fromURL(url).then(dom => {
      // Get spec date
      let latestDate = new Date(dom.window.document.querySelector("time").textContent);

      let data = [
        { date: latestDate, url: url }
      ];

      // Get previous specs
      let prevs = dom.window.document.querySelectorAll("[rel='prev']");
      for (let i = 0; i < prevs.length; i++) {
        let node = prevs[i];
        let href = node.href;
        let parts = /([0-9]{4})([0-9]{2})([0-9]{2})\/$/.exec(href);
        let pubdate = new Date(parts[1], parts[2]-1, parts[3]);
        data.push({ date: pubdate, url: href });
      }
      resolve(data);
    });
  });
}

/*

  Given a Google Trends URL (from the download csv button), parse into JS
  dates and values

  [
    { date: "2017-11-01", value: "23" }
    ...
  ]

  https://trends.google.com/trends/api/widgetdata/multiline/csv?req=%7B%22time%22%3A%222004-01-01%202018-02-09%22%2C%22resolution%22%3A%22MONTH%22%2C%22locale%22%3A%22en-US%22%2C%22comparisonItem%22%3A%5B%7B%22geo%22%3A%7B%7D%2C%22complexKeywordsRestriction%22%3A%7B%22keyword%22%3A%5B%7B%22type%22%3A%22BROAD%22%2C%22value%22%3A%22css%20grid%22%7D%5D%7D%7D%5D%2C%22requestOptions%22%3A%7B%22property%22%3A%22%22%2C%22backend%22%3A%22IZG%22%2C%22category%22%3A0%7D%7D&token=APP6_UEAAAAAWn9he6eWkoq3h9c10prQWzUw4Hso4H88&tz=480

*/
function googleTrends(url) {
  return new Promise(function(resolve, reject) {
    let url = 'https://trends.google.com/trends/api/widgetdata/multiline/csv?req=%7B%22time%22%3A%222004-01-01%202018-02-09%22%2C%22resolution%22%3A%22MONTH%22%2C%22locale%22%3A%22en-US%22%2C%22comparisonItem%22%3A%5B%7B%22geo%22%3A%7B%7D%2C%22complexKeywordsRestriction%22%3A%7B%22keyword%22%3A%5B%7B%22type%22%3A%22BROAD%22%2C%22value%22%3A%22css%20grid%22%7D%5D%7D%7D%5D%2C%22requestOptions%22%3A%7B%22property%22%3A%22%22%2C%22backend%22%3A%22IZG%22%2C%22category%22%3A0%7D%7D&token=APP6_UEAAAAAWn9he6eWkoq3h9c10prQWzUw4Hso4H88&tz=480';
    var request = require('request');
    request(url, function (error, response, body) {
      let values = body.split('\n').slice(3).map(function(str) {
        let parts = str.split(',');
        return { date: new Date(parts[0]), value: parts[1] };
      });
      resolve(values);
    });
  });
}

/*
 *  Get timeline of browser releases (browser, version, release date)
 *
 *  Gets names from https://github.com/mdn/browser-compat-data/blob/master/schemas/browsers.schema.json
 *
 *  Gets files by name from https://github.com/mdn/browser-compat-data/tree/master/browsers
 */
function browserTimeline() {
  return new Promise(function(resolve, reject) {
    let browsersURL = 'https://raw.githubusercontent.com/mdn/browser-compat-data/master/schemas/browsers.schema.json';
    let browserURLBase = 'https://raw.githubusercontent.com/mdn/browser-compat-data/master/browsers/';
    let request = require('request');
    request(browsersURL, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        let promises = Object.keys(data.definitions.browsers.properties).map(function(browser) {
          let browserURL = browserURLBase + browser + '.json';
          return new Promise(function(res, rej) {
            let browserURL = browserURLBase + browser + '.json';
            request(browserURL, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                res(JSON.parse(body).browsers);
              }
              else {
                let empty = {};
                empty[browser] = { releases: {} };
                res(empty);
              }
            });
          });
        });
        Promise.all(promises).then(function(values) {
          resolve(values);
        });
      }
    });
  });
}

browserTimeline().then(function(data) {
  console.log('data', data);
});

// TODO: parameterize the timeline for any feature based on mdn api data
// aka click through to timeline from any mdn page
// auto load gtrends search data, etc
// https://github.com/mdn/browser-compat-data
// https://github.com/mdn/browser-compat-data/blob/master/css/properties/grid.json
// add Chrome's usage data
let config = {
  title: "CSS Grid",
  sources: [
    { type: 'w3c', category: 'standards', url: 'https://www.w3.org/TR/css-grid-1/' },
    { type: 'googletrends', category: 'metrics', url: 'https://trends.google.com/trends/api/widgetdata/multiline/csv?req=%7B%22time%22%3A%222004-01-01%202018-02-09%22%2C%22resolution%22%3A%22MONTH%22%2C%22locale%22%3A%22en-US%22%2C%22comparisonItem%22%3A%5B%7B%22geo%22%3A%7B%7D%2C%22complexKeywordsRestriction%22%3A%7B%22keyword%22%3A%5B%7B%22type%22%3A%22BROAD%22%2C%22value%22%3A%22css%20grid%22%7D%5D%7D%7D%5D%2C%22requestOptions%22%3A%7B%22property%22%3A%22%22%2C%22backend%22%3A%22IZG%22%2C%22category%22%3A0%7D%7D&token=APP6_UEAAAAAWn9he6eWkoq3h9c10prQWzUw4Hso4H88&tz=480'}
  ]
}
