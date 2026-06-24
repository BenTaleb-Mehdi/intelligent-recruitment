const express = require('express');
const passport = require('passport');
const { register, login, oauthSuccess } = require('../controllers/authController');

const router = express.Router();

// Local Auth Routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'ROLE_CANDIDAT';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: role,
    session: false
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=google_failed`,
    session: false
  })(req, res, next);
}, oauthSuccess);

// GitHub OAuth
router.get('/github', (req, res, next) => {
  const role = req.query.role || 'ROLE_CANDIDAT';
  if (role === 'ROLE_RECRUTEUR') {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'GitHub login is strictly prohibited for Recruiters.' }
    });
  }
  passport.authenticate('github', {
    scope: ['user:email'],
    state: role,
    session: false
  })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=github_failed`,
    session: false
  })(req, res, next);
}, oauthSuccess);

// LinkedIn OAuth
router.get('/linkedin', (req, res, next) => {
  const role = req.query.role || 'ROLE_CANDIDAT';
  passport.authenticate('linkedin', {
    state: role,
    session: false
  })(req, res, next);
});

router.get('/linkedin/callback', (req, res, next) => {
  passport.authenticate('linkedin', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=linkedin_failed`,
    session: false
  })(req, res, next);
}, oauthSuccess);

module.exports = router;
