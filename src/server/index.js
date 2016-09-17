import express from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import debug from 'debug';
import { getDatabase } from './db/mongo';
import routes from './api/routes';

const app = express();
const log = debug('papairus:app');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use('/api', routes);

getDatabase((err) => {
  if (err) {
    log('Unable to start application without database.');
    process.exit(1);
  }

  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    log('App now running on port %s', port);
  });
});

export default app;
