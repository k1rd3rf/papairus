import debug from 'debug';
import { getDatabase, getId } from '../../db/mongo';
import { handleError } from '../error';
import { getNewMember } from './member';

const log = debug('papairus:members:controller');

const collection = 'members';

let db;

getDatabase((err, database) => {
  if (err) {
    log('Need database in order to use members API.');
    process.exit(1);
  }
  db = database;
});

/**
 * Returns a list of all the members
 * @param {object} req request object
 * @param {object} res response object
 * @param next
 */
export function list(req, res, next) {
  db.collection(collection).find({}).toArray((err, docs) => {
    if (err) {
      handleError(res, err.message, 'Failed to get members.');
    } else {
      res.status(200).json(docs);
    }
    next();
  });
}

export function create(req, res, next) {
  getNewMember(req.body || {}, (err, newMember) => {
    if (err) {
      handleError(res, err.reason, err.message, err.code);
      next();
    } else {
      db.collection(collection).insertOne(newMember, (dbErr, doc) => {
        if (dbErr) {
          handleError(res, dbErr.message, 'Failed to create new member.');
        } else {
          res.status(201).json(doc.ops[0]);
        }
        next();
      });
    }
  });
}

export function show(req, res, next) {
  db.collection(collection).findOne(getId(req), (err, doc) => {
    if (err) {
      handleError(res, err.message, 'Failed to get member');
    } else {
      res.status(200).json(doc);
    }
    next();
  });
}

export function update(req, res, next) {
  const updateDoc = req.body;
  delete updateDoc._id;
  db.collection(collection).updateOne(getId(req), updateDoc, (err) => {
    if (err) {
      handleError(res, err.message, 'Failed to update member.');
    } else {
      res.status(204).end();
    }
    next();
  });
}

export function destroy(req, res, next) {
  db.collection(collection).deleteOne(getId(req), (err) => {
    if (err) {
      handleError(res, err.message, 'Failed to delete member.');
    } else {
      res.status(204).end();
    }
    next();
  });
}
