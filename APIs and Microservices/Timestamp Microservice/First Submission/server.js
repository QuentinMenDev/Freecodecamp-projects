// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// API endpoint for Timestamp Microservice
app.get("/api/timestamp/:date_string?", (req, res) => {
  let date = req.params.date_string
  let valideDate = /\d{5,}/

  if (valideDate.test(date)) {
    let dateInt = parseInt(date)
    res.json({ unix: dateInt, utc: new Date(dateInt).toUTCString() })
  }
  
  let dateObj = date==undefined?new Date():new Date(date)

  if (dateObj.toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" })
  } else {
    res.json({ unix: dateObj.valueOf(), utc: dateObj.toUTCString() })
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});