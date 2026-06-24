const mongoose = require('mongoose');

const RecruiterSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id
RecruiterSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('Recruiter', RecruiterSchema);
