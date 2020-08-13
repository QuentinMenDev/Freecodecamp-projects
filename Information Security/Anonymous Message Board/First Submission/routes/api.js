/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect   = require('chai').expect;

const moment = require('moment')

const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const boardSchema = Schema({
  _id: Schema.Types.ObjectId,
  board_name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20
  },
  threads: [{ type: Schema.Types.ObjectId, ref: 'Thread' }]
})
const Board = mongoose.model('Board', boardSchema)

const threadSchema = new Schema({
  _id: Schema.Types.ObjectId,
  text: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: moment().format()
  },
  bumped_on: {
    type: Date,
    default: moment().format()
  },
  reported: {
    type: Boolean,
    default: false
  },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }]
})
threadSchema.post('remove', doc => {
  Reply.deleteMany({
    _id: { "$in": doc.replies }
  }, {}, err => {});
})
const Thread = mongoose.model('Thread', threadSchema)

const replySchema = new Schema({
  _id: Schema.Types.ObjectId,
  text: {
    type: String,
    required: true,
    maxlength: 3000
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 24
  },
  created_on: {
    type: Date,
    default: moment().format()
  },
  reported: {
    type: Boolean,
    default: false
  }
})
const Reply = mongoose.model('Reply', replySchema)

mongoose.connect(process.env.DB, { useNewUrlParser: true, useFindAndModify: false })

module.exports = app => {
  
  app.route('/api/threads/:board')
    .get((req, res) => {
      Board.findOne({ board_name: req.params.board })
        .populate({
          path: 'threads',
          select: '-reported -password',
          options: {
            limit: 10,
            sort: {
              bumped_on: -1
            }
          },
          populate: {
            path: 'replies',
            model: 'Reply',
            options: {
              sort: {
                created_on: -1
              }
            }
          }
        })
        .select('threads')
        .exec((err, docs) => {
          if(err || !docs) res.send("Error while retrieving threads.")

          let threads = docs.threads.map(thread => {
            return {
              _id: thread._id,
              text: thread.text,
              created_on: thread.created_on,
              bumped_on: thread.bumped_on,
              replies: thread.replies.slice(0, 3),
              replycount: thread.replies.length
            }
          })
        
          return res.json(threads)
        })
    })
    .post((req, res) => {
      let board
      
      Board.findOne({ board_name: req.params.board }, (err, doc) =>{
        if(err) res.send("Couldn't post new thread")
        
        if(doc) {
          board = doc
        } else {
          board = new Board({
            _id: mongoose.Types.ObjectId(),
            board_name: req.params.board
          })
        }
        
        let newThread = new Thread({
          _id: new mongoose.Types.ObjectId(),
          text: req.body.text,
          password: req.body.delete_password,
          created_on: moment().format(),
          bumped_on: moment().format(),
          reported: false
        })
        
        board.threads.push(newThread)
        
        newThread.save(err => {
          if(err) res.send("Couldn't post new thread")

          board.save(err => {
            if(err) res.send("Couldn't post new thread")

            return res.redirect(`/b/${board.board_name}?_id=${newThread._id}`)
          })
        })
      })
    })
    .put((req, res) => {
      Thread.findByIdAndUpdate(
        req.body.report_id,
        { $set: { reported: true } },
        (err, doc) => {
          if(err || !doc) res.send("Couldn't report the thread.")
          
          return res.send('Report successful.')
        })
    })
    .delete((req, res) => {
        Board.findOne({ board_name: req.params.board })
          .populate({
            path: 'threads',
            match: {
              _id: req.body.thread_id,
              password: req.body.delete_password
            }
          })
          .select('threads')
          .exec((err, doc) => {
            if(err || !doc || doc.threads.length === 0) res.send('Incorrect password.')
            
            Board.findOneAndUpdate(
              { board_name: req.params.board },
              { 
                $pull: { 
                  threads: req.body.thread_id 
                } 
              },
              (err, doc) => {}
            )

            doc.threads[0].remove()
          
            return res.send('Delete successfull.')
        });
    });
    
  app.route('/api/replies/:board')
    .get((req, res) => {
      if(!req.query.thread_id) res.send("Error while retrieving data.")
    
      Board.findOne({ board_name: req.params.board })
        .populate({
          path: 'threads',
          match: { _id: req.query.thread_id },
          populate: { 
            ath: 'replies',
            model: 'Reply',
            select: '-reported -password'
          }
        })
        .select('threads')
        .exec((err, docs) => {
          if(err) res.send("Error while retrieving data.")
        
          return res.json(docs.threads[0])
        })
    })
    .post((req, res) => {
      Board.findOne({ board_name: req.params.board })
        .populate({
          path: 'threads',
          match: { _id: req.body.thread_id }
        })
        .select('threads')
        .exec((err, doc) => {
          if(err || !doc || doc.threads.length === 0) res.send("Couldn't reply to the thread.")

          let newReply = new Reply({
            _id        : mongoose.Types.ObjectId(),
            text       : req.body.text,
            password   : req.body.delete_password,
            created_on : moment().format(),
            reported   : false
          })
        
          doc.threads[0].bumped_on = moment().format()
          doc.threads[0].replies.push(newReply)

          newReply.save(err => {
            if(err) res.send("Couldn't reply to the thread.")

            doc.threads[0].save(err => {
              if(err) res.send("Couldn't reply to the thread.")

              return res.redirect(`/b/${req.params.board}/${req.body.thread_id}`)
            })
          })
        })
    })
    .put((req, res) => {
      Reply.findByIdAndUpdate(
        req.body.reply_id,
        { $set: { reported: true } },
        (err, doc) => {
          if(err || !doc) res.send("Couldn't report the reply.")
          
          return res.send('Report successful.')
        })
    })
    .delete((req, res) => {
      Board.findOne({ board_name: req.params.board })
        .populate({
          path: 'threads',
          match: { _id: req.body.thread_id },
          populate: {
            path: 'replies',
            model: 'Reply',
            match: {
              _id: req.body.reply_id,
              assword: req.body.delete_password
            }
          }
        })
        .select('replies')
        .exec((err, doc) => {
          if(err || !doc || (doc.threads.length === 0) || (doc.threads[0].replies.length === 0)) res.send('Incorrect password.')

          Thread.findOneAndUpdate(
            { _id: req.body.thread_id },
            {
              $pull: {
                replies: req.body.reply_id
              }
            },
            (err, doc) => {}
          )

          doc.threads[0].replies[0].remove()

          return res.send('Delete successfull.')
      });
    });

};