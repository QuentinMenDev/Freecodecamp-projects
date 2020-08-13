/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;

const mongoose = require("mongoose")
const Schema = mongoose.Schema
mongoose.connect(process.env.DB)

const bookSchema = new Schema({
  title: String,
  comments: []
})
const Book = mongoose.model('Book', bookSchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find((err, data) => {
        if(err) res.json(err)
        
        let answer = data.map(elem => {
          return {
            _id: elem.id,
            title: elem.title,
            commentcount: elem.comments.length
          }
        })
        
        res.json(answer)
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) res.json('title is required')
      
      let newBook = new Book({ title })
      
      newBook.save((err, data) => {
        if(err) res.json(err)
        res.json({title: data.title, _id: data._id})
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, data) => {
        if(err) res.json(err)
        res.json('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (!bookid) res.json('id is required')
    
      Book.findById(bookid, (err, data) => {
        if(err) res.json(err)
        if(!data) res.json('no book exists')
        
        res.json(data)
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
      if (!bookid) res.json('id is required')
    
      Book.findById(bookid, (err, data) => {
        if(err) res.json(err)
        if(!data) res.json('no book exists')
        
        data.comments.push(comment)
        
        data.save((err, answer) => {
          if(err) res.json(err)
          res.json(answer)
        })
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (!bookid) res.json('id is required')
    
      Book.findByIdAndRemove(bookid, (err, data) => {
        if(err) res.json(err)
        res.json('delete successful')
      })
    });
  
};
