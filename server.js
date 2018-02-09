// server.js
// where your node app starts

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

app.get("/query", function (request, response) {
  
  response.send(dreams);
    
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Get spec history (url+date) from latest w3c spec
function w3c(url) {
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
    return data;
  });
}

//let url = 'https://www.w3.org/TR/css-grid-1/';

