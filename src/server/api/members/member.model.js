import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now(),
    required: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  startedDate: {
    type: Date,
    default: Date.now(),
    required: true
  }
});

MemberSchema.set('validateBeforeSave', true);
MemberSchema.path('userId').validate(
  userId => /^[a|A|c|C][c|C]\d{5}$/.test(userId),
  'Expected userId to start with AC or CC, followed by 5 digits.'
);

const Member = mongoose.model('Member', MemberSchema);

export default Member;

