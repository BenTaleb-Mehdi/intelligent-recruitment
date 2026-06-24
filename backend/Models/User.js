const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: function() {
      // passwordHash is only required if no social auth providers are linked
      return !this.googleId && !this.githubId && !this.linkedinId;
    }
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }],
  // Social Auth IDs
  googleId: String,
  githubId: String,
  linkedinId: String
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }, // only createdAt as per class diagram
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id
UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('User', UserSchema);
