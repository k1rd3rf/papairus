import moment from 'moment';

export function validateUserId(userId) {
  return /^[a|A|c|C][c|C]\d{5}$/.test(userId);
}

/**
 * Validates and creates a new member
 * @param body {{userId: String, name: String, startDate: Date}}
 * @param {Function} callback
 * @returns {{createdDate: Date, userId: String, name: String, startDate: Date}}
 */
export function getNewMember(body, callback) {
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

export default { validateUserId, getNewMember };
