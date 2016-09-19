import debug from 'debug';
import mongoose from 'mongoose';
import Promise from 'bluebird';

mongoose.Promise = Promise;

const log = debug('papairus:db:mongo');
const error = debug('papairus:db:mongo:error');

let db;

export function initDatabase(callback) {
  const dbUrl = process.env.MONGODB_URI;
  if (!dbUrl) {
    const err = 'MONGODB_URI not set.';
    error(err);
    callback(err, null);
  }

  if (!db) {
    mongoose.connect(dbUrl);
    db = mongoose.connection;
    db.on('error', error);
    db.once('open', () => {
      log('Database connection is open');
      callback(null, db);
    });
  }
}

export default initDatabase;
