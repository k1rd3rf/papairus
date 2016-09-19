import Member from './member.model';
import { NotFoundError, ValidationError } from '../../error';

/**
 * Returns a list of all the members
 * @param {object} req request object
 * @param {object} res response object
 * @param next
 */
export function list(req, res, next) {
  Member.find()
    .then(members => res.json(members))
    .catch(next);
}

export function create(req, res, next) {
  Member({
    userId: req.body.userId,
    startedDate: req.body.startedDate,
    name: req.body.name
  }).save()
    .catch((err) => {
      throw new ValidationError(err.message);
    })
    .then(member => res.json(member))
    .catch(next);
}

function getMember(userId) {
  return Member.findOne({ userId: { $regex: `^${userId}$`, $options: 'i' } })
    .then((member) => {
      if (member) {
        return member;
      }
      throw new NotFoundError(`member, ${userId}`);
    });
}

export function show(req, res, next) {
  const userId = req.params.id;
  getMember(userId)
    .then(member => res.json(member))
    .catch(next);
}

export function update(req, res, next) {
  const userId = req.params.id;
  getMember(userId)
    .then(member => Member(Object.assign(member, req.body)))
    .then(member => member.save())
    .catch((err) => {
      throw new ValidationError(err.message);
    })
    .then(member => res.json(member))
    .catch(next);
}

export function destroy(req, res, next) {
  const userId = req.params.id;
  getMember(userId)
    .then(member => member.remove())
    .then(res.status(204).end())
    .catch(next);
}
