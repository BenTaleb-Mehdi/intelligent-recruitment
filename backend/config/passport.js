const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const User = require('../Models/User');
const Role = require('../Models/Role');
const Candidate = require('../Models/Candidate');
const Recruiter = require('../Models/Recruiter');

const parseRoleFromState = (req) => {
  let roleName = 'ROLE_CANDIDAT'; // default
  if (req.query && req.query.state) {
    try {
      const stateStr = req.query.state;
      if (stateStr.startsWith('{')) {
        const stateObj = JSON.parse(stateStr);
        roleName = stateObj.role || roleName;
      } else {
        roleName = stateStr;
      }
    } catch (e) {
      console.error('Error parsing OAuth state:', e);
    }
  }
  return roleName;
};

const handleSocialLogin = async (req, provider, providerId, email, profile, done) => {
  try {
    if (!email) {
      return done(new Error(`Email not provided by ${provider}`));
    }

    let user = await User.findOne({ email }).populate('roles');
    const roleName = parseRoleFromState(req);

    // Enforce: Recruiters cannot use GitHub
    if (provider === 'github' && roleName === 'ROLE_RECRUTEUR') {
      return done(new Error('GitHub login is strictly prohibited for Recruiters.'));
    }

    if (user) {
      // User exists, link social provider if not already linked
      let updated = false;
      if (provider === 'google' && !user.googleId) {
        user.googleId = providerId;
        updated = true;
      } else if (provider === 'github' && !user.githubId) {
        user.githubId = providerId;
        updated = true;
      } else if (provider === 'linkedin' && !user.linkedinId) {
        user.linkedinId = providerId;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
      return done(null, user);
    }

    // New User Registration
    const roleObj = await Role.findOne({ name: roleName });
    if (!roleObj) {
      return done(new Error(`Role ${roleName} not found in database.`));
    }

    const userData = {
      email,
      roles: [roleObj._id],
      googleId: provider === 'google' ? providerId : undefined,
      githubId: provider === 'github' ? providerId : undefined,
      linkedinId: provider === 'linkedin' ? providerId : undefined
    };

    const newUser = await User.create(userData);

    // Profile creation
    const displayName = profile.displayName || '';
    const nameParts = displayName.split(' ');
    const firstName = profile.name?.givenName || nameParts[0] || '';
    const lastName = profile.name?.familyName || nameParts.slice(1).join(' ') || '';

    if (roleName === 'ROLE_CANDIDAT') {
      await Candidate.create({
        _id: newUser._id,
        firstName,
        lastName,
        phone: '',
        employabilityScore: 0.0,
        careerSuggestions: []
      });
      console.log(`✅ Created Candidate profile for OAuth User: ${email}`);
    } else if (roleName === 'ROLE_RECRUTEUR') {
      await Recruiter.create({
        _id: newUser._id,
        companyName: '',
        position: '',
        industry: ''
      });
      console.log(`✅ Created Recruiter profile for OAuth User: ${email}`);
    }

    const populatedUser = await User.findById(newUser._id).populate('roles');
    return done(null, populatedUser);
  } catch (err) {
    return done(err);
  }
};

// 1. Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    await handleSocialLogin(req, 'google', profile.id, email, profile, done);
  }
));

// 2. GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'dummy-github-client-id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret',
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    await handleSocialLogin(req, 'github', profile.id, email, profile, done);
  }
));

// 3. LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID || 'dummy-linkedin-client-id',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'dummy-linkedin-client-secret',
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/linkedin/callback`,
    scope: ['r_emailaddress', 'r_liteprofile'],
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    await handleSocialLogin(req, 'linkedin', profile.id, email, profile, done);
  }
));

// Session serialization (since we use stateless JWT, these are just required boilerplate)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).populate('roles');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
