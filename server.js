"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var morgan = require("morgan");
var ObjectID = mongodb.ObjectID;

var MEMBER_COLLECTION = "members";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.use(morgan('combined'));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason, message);
  res.status(code || 500).json({"error": message, "reason": reason});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/status", function (req, res) {
  res.status(200).json({"up": true})
});

var baseUrl = "/members";

app.get(baseUrl, function (req, res) {
  db.collection(MEMBER_COLLECTION).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get members.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post(baseUrl, function (req, res) {
  db.collection(MEMBER_COLLECTION).insertOne(getNewMember(req.body || {}, res), function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new member.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/**
 *  "/members/:id"
 *    GET: find member by id
 *    PUT: update member by id
 *    DELETE: deletes member by id
 */
app.get(baseUrl + "/:id", function (req, res) {
  db.collection(MEMBER_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get member");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put(baseUrl + "/:id", function (req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(MEMBER_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function (err) {
    if (err) {
      handleError(res, err.message, "Failed to update member.");
    } else {
      res.status(204).end();
    }
  });
});

app.delete(baseUrl + "/:id", function (req, res) {
  db.collection(MEMBER_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function (err) {
    if (err) {
      handleError(res, err.message, "Failed to delete member.");
    } else {
      res.status(204).end();
    }
  });
});

/**
 * Validates and creates a new member
 * @param body {{userId: String, name: String, startDate: Date}}
 * @param res result
 * @returns {{createdDate: Date, userId: String, name: String, startDate: Date}}
 */
function getNewMember(body, res) {
  var newMember = {};

  newMember.createDate = new Date();
  newMember.userId = body.userId;

  if (!(body.userId && body.userId.length === 7)) {
    handleError(res, "Invalid user input", "userId: '" + body.userId + "' is invalid. Must provide a userId with 7 characters.", 400);
  }

  newMember.name = body.name || body.userId;
  newMember.startDate = body.startDate || new Date();
  return newMember;
}
