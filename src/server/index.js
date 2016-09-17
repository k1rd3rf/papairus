import express from 'express';
import path from 'path';
import * as bodyParser from 'body-parser';
import mongodb from 'mongodb';
import morgan from 'morgan-debug';
import moment from 'moment';
import debug from 'debug';
import { validateUserId } from './validator';
import { getDatabase } from './db/mongo';

const MEMBER_COLLECTION = 'members';
const ObjectID = mongodb.ObjectID;
const app = express();

app.use(express.static(path.join('/public')));
app.use(bodyParser.json());
app.use(morgan('papairus', 'combined'));

const log = debug('papairus:app');
let db;

getDatabase((err, database) => {
  if (err) {
    process.exit(1);
  }

  db = database;

  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    log('App now running on port %s', port);
  });
});


function handleError(res, reason, message, code) {
  log(`ERROR: ${reason}. %s`, message);
  res.status(code || 500).json({ error: message, reason });
}

/**
 * Validates and creates a new member
 * @param body {{userId: String, name: String, startDate: Date}}
 * @param {Function} callback
 * @returns {{createdDate: Date, userId: String, name: String, startDate: Date}}
 */
function getNewMember(body, callback) {
  const newMember = {};
  let err = null;
  newMember.createDate = new Date();
  newMember.userId = body.userId;


  if (!(body.userId && body.userId.length === 7 && validateUserId(body.userId))) {
    const desc = 'Must provide a userId with 7 characters that starts with either ' +
      'AC or CC and is followed by 5 digits (example: AC12345).';
    err = {
      reason: 'Invalid user input',
      message: `userId: '${body.userId}' is invalid. ${desc}`,
      code: 400
    };
  }

  newMember.name = body.name || body.userId;
  newMember.startDate = moment(body.startDate).toDate();

  return callback(err, newMember);
}


const baseUrl = '/members';

/**
 *  "/members"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */
app.get(baseUrl, (req, res) => {
  db.collection(MEMBER_COLLECTION).find({}).toArray((err, docs) => {
    if (err) {
      handleError(res, err.message, 'Failed to get members.');
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post(baseUrl, (req, res) => {
  getNewMember(req.body || {}, (err, newMember) => {
    if (err) {
      handleError(res, err.reason, err.message, err.code);
    } else {
      db.collection(MEMBER_COLLECTION).insertOne(newMember, (dbErr, doc) => {
        if (dbErr) {
          handleError(res, dbErr.message, 'Failed to create new member.');
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    }
  });
});

/**
 *  "/members/:id"
 *    GET: find member by id
 *    PUT: update member by id
 *    DELETE: deletes member by id
 */
app.get(`${baseUrl}/:id`, (req, res) => {
  db.collection(MEMBER_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, (err, doc) => {
    if (err) {
      handleError(res, err.message, 'Failed to get member');
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put(`${baseUrl}/:id`, (req, res) => {
  const updateDoc = req.body;
  delete updateDoc._id;
  const objectID = new ObjectID(req.params.id);

  db.collection(MEMBER_COLLECTION).updateOne({ _id: objectID }, updateDoc, (err) => {
    if (err) {
      handleError(res, err.message, 'Failed to update member.');
    } else {
      res.status(204).end();
    }
  });
});

app.delete(`${baseUrl}/:id`, (req, res) => {
  db.collection(MEMBER_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, (err) => {
    if (err) {
      handleError(res, err.message, 'Failed to delete member.');
    } else {
      res.status(204).end();
    }
  });
});
