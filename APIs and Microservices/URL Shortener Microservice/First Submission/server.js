'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const Schema = mongoose.Schema

const bodyParser = require('body-parser')

const dns = require('dns')
const url = require('url')

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect("mongodb+srv://admin:tunbouffonvv@freecodecamp-course-zzf9t.gcp.mongodb.net/test?retryWrites=true&w=majority");

// Schema for mongoDB
const shortenUrlSchema = new Schema({
  url: String
})
const ShortenUrl = mongoose.model('ShortenUrl', shortenUrlSchema)

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", (req, res) => {
  const originalUrl = req.body.url
  const urlString = url.parse(req.body.url).hostname

  // check if url is valid
  dns.lookup(urlString, (err, data) => {
    if(err) return res.json({"error":"invalid url"})
    
    // check if url is already in the databse
    ShortenUrl.findOne({url: urlString}, (err, data) => {
      if (err) return console.error(err)
      
      if (data) {
        // if exists, send the saved data
        res.json({original_url: originalUrl, short: data._id})
      } else {
        // if doesn't exist, save new entry and send the newly saved data
        let newUrl = new ShortenUrl({url: urlString})
        
        newUrl.save((err, data) => {
          if(err) console.error(err)
          res.json({original_url: originalUrl, short: data._id})
        })
      }
    })
  })
})
app.get("/api/shorturl/:url", (req, res) => {
  // check if url is in database
  const hashed = req.params.url
  
  ShortenUrl.findById({ _id: hashed}, (err, data) => {
    if(err) res.json({"error":"invalid url"})
    
    res.redirect('https://' + data.url)
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});