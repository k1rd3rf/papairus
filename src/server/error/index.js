export class NotFoundError extends Error {
  constructor(type) {
    const message = `Did not find ${type}.`;
    super(message);
    this.status = 404;
    this.name = 'NotFoundError';
    this.message = message;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.name = 'ValidationError';
    this.message = message;
  }
}

export default { NotFoundError, ValidationError };
