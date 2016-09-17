import debug from 'debug';
import mongodb from 'mongodb';

const log = debug('papairus:db:mongo');

let db;

// Connect to the database before starting the application server.
const dbUrl = process.env.MONGODB_URI;

if (!dbUrl) {
  log('MONGODB_URI not set.');
  process.exit(1);
}

export function getDatabase(callback) {
  if (!db) {
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

export default { getDatabase };
