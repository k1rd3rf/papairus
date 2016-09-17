import debug from 'debug';
import mongodb from 'mongodb';

const log = debug('papairus:db:mongo');

let db;

const dbUrl = process.env.MONGODB_URI;

export function getDatabase(callback) {
  if (!dbUrl) {
    const error = 'MONGODB_URI not set.';
    log(error);
    callback({ message: error }, null);
  }

  if (!db) {
    log('Initializing database connection');
    mongodb.MongoClient.connect(dbUrl, (err, database) => {
      if (err) {
        log(err);
      }

      db = database;
      callback(err, db);
    });
  } else {
    callback(null, db);
  }
}

export function getId(req) {
  return { _id: new mongodb.ObjectID(req.params.id) };
}

export default { getDatabase };
