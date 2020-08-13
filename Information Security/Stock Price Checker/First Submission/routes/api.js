/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

const fetch = require("node-fetch")

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const stockSchema = new Schema({
  symbol: String,
  likes: Number,
  likeIp: []
})
const Stock = mongoose.model('Stock', stockSchema)

mongoose.connect(process.env.DB, { useFindAndModify: false })

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      if (Array.isArray(req.query.stock)) {
        let allData = []
        fetch('https://repeated-alpaca.glitch.me/v1/stock/' + req.query.stock[0] + '/quote')
        .then(resp => resp.json())
        .then(data => {
          allData.push(data)
          
          return fetch('https://repeated-alpaca.glitch.me/v1/stock/' + req.query.stock[1] + '/quote')
        })
        .then(resp => resp.json())
        .then(data => {
          allData.push(data)
          
          let testData = [allData[0].symbol, allData[1].symbol]
          
          Stock.find({symbol: {
            $in: testData
          }}, (err, data) => {
            let totalLikes = 0
            let items = []
            
            for (let i = 0 ; i < 2 ; i++) {
              if (!data.find(elem => elem.symbol === allData[i].symbol)) {
                let likeIp = []
                if (req.query.like) likeIp.push(req.connection.remoteAddress)

                let newStock = new Stock({
                  symbol: allData[i].symbol,
                  likes: req.query.like?1:0,
                  likeIp
                })
                newStock.save((err, ans) => {
                  if(err) res.json(err)
                  totalLikes += (req.query.like?1:0)
                  
                  items.push({
                    stock: allData[i].symbol,
                    price: allData[i].latestPrice,
                    rel_likes: req.query.like?1:0
                  })
                  
                  if (items.length === 2) {
                    let relLikes = [items[0].rel_likes - items[1].rel_likes, items[1].rel_likes - items[0].rel_likes]
                    items[0].rel_likes = relLikes[0]
                    items[1].rel_likes = relLikes[1]
                    res.json({stockData: items})
                  }
                })
              } else {
                let likes = data[i].likes
                let likeIp = data[i].likeIp

                if (!data[i].likeIp.find(elem => elem === req.connection.remoteAddress)) {
                  if (req.query.like) {
                    likes++
                    likeIp.push(req.connection.remoteAddress)
                  }
                }

                Stock.findByIdAndUpdate(data[i]._id, {likes, likeIp}, (err, elem) => {
                  if(err) res.json(err)
                  totalLikes += likes
                  
                  items.push({
                    stock: allData[i].symbol,
                    price: allData[i].latestPrice,
                    rel_likes: likes
                  })
                  
                  if (items.length === 2) {
                    let relLikes = [items[0].rel_likes - items[1].rel_likes, items[1].rel_likes - items[0].rel_likes]
                    items[0].rel_likes = relLikes[0]
                    items[1].rel_likes = relLikes[1]
                    res.json({stockData: items})
                  }
                })
              }
            }
          })
        })
      } else {
        fetch('https://repeated-alpaca.glitch.me/v1/stock/' + req.query.stock + '/quote')
        .then(resp => resp.json())
        .then(data => {        
          Stock.find({symbol: data.symbol}, (err, answer) => {
            if(err) res.json(err)

            if (answer.length === 0) {
              let likeIp = []
              if (req.query.like) likeIp.push(req.connection.remoteAddress)

              let newStock = new Stock({
                symbol: data.symbol,
                likes: req.query.like?1:0,
                likeIp
              })
              newStock.save((err, ans) => {
                if(err) res.json(err)

                res.json({
                  stockData: {
                    stock: data.symbol,
                    price: data.latestPrice,
                    likes: ans.likes,
                    likeIp
                  }
                })
              })
            } else {
              let likes = answer[0].likes
              let likeIp = answer[0].likeIp

              if (!answer[0].likeIp.find(elem => elem === req.connection.remoteAddress)) {
                if (req.query.like) {
                  likes++
                  likeIp.push(req.connection.remoteAddress)
                }
              }

              Stock.findByIdAndUpdate(answer[0]._id, {likes, likeIp}, (err, elem) => {
                res.json({
                  stockData: {
                    stock: data.symbol,
                    price: data.latestPrice,
                    likes: likes
                  }
                })
              })
            }
          })
        })
        .catch(err => console.log(err))
      }
    });
    
};