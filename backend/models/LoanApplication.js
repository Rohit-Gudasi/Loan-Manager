const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: String,
  amount: Number,
  tenure: Number,
  reason: String,
  employmentStatus: String,
  employmentAddress: String,
  status: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoanApplication', loanSchema);
