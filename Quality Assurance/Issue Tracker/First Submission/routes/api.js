/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var ObjectId = require("mongodb").ObjectID;

const moment = require("moment");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema
const issueSchema = new Schema({
  issue_title: String,
  issue_text: String,
  created_on: Date,
  updated_on: Date,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String
});
const Issue = mongoose.model("Issue", issueSchema);

mongoose.connect(process.env.DB);

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      console.log(req.query);
      let queries = {}
      for (let elem in req.query) {
        queries[elem] = req.query[elem]
      }
      
      Issue.find(queries, (err, data) => {
        if(err) console.error(err)
        res.json(data)
      })
    })

    .post(function(req, res) {
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.json('missing inputs')
      } else {
        const newIssue = new Issue({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: moment().format(),
          updated_on: moment().format(),
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          open: true,
          status_text: req.body.status_text
        })

        newIssue.save((err, data) => {
          if (err) console.error(err);
          res.json(data);
        });
      }
    })

    .put(function(req, res) {
      let toUpdate = {};
      let empty = true;
      for (let elem in req.body) {
        if (req.body[elem]) {
          toUpdate[elem] = req.body[elem];
          empty = false;
        }
      }

      if (empty) {
        res.json("no updated field sent");
      } else {
        toUpdate.updated_on = moment().format();

        Issue.findByIdAndUpdate(req.body._id, toUpdate, (err, data) => {
          if (err) res.json("could not update " + req.body._id);
          res.json("successfully updated");
        });
      }
    })

    .delete(function(req, res) {
      if (req.body._id === "") {
        res.json("_id error");
      } else {
        Issue.findByIdAndRemove(req.body._id, (err, data) => {
          if (err) res.json("could not delete " + req.body._id);
          res.json("deleted " + req.body._id);
        });
      }
    });
};
