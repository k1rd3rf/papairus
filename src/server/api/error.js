import debug from 'debug';

const log = debug('papairus:api:error');

export function handleError(res, reason, message, code) {
  log(`Reason: ${reason}`);
  log(`Message: ${message}`);

  res.status(code || 500).json({ error: message, reason });
}

export default { handleError };
