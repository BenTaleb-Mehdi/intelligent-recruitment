const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  employabilityScore: {
    type: Number,
    default: 0.0,
    min: 0.0,
    max: 1.0
  },
  careerSuggestions: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id
CandidateSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('Candidate', CandidateSchema);
