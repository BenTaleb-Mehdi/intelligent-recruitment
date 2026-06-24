const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Role = require('../Models/Role');
const Candidate = require('../Models/Candidate');
const Recruiter = require('../Models/Recruiter');

// Helper to generate JWT Token
const generateToken = (user) => {
  const roles = user.roles.map(r => r.name);
  // Get first role as primary role or default
  const primaryRole = roles[0] || 'ROLE_CANDIDAT';
  
  // Aggregate all permissions from all roles
  const permissions = user.roles.reduce((acc, r) => {
    if (r.permissions && Array.isArray(r.permissions)) {
      r.permissions.forEach(p => {
        if (!acc.includes(p)) acc.push(p);
      });
    }
    return acc;
  }, []);

  return jwt.sign(
    {
      userId: user._id,
      role: primaryRole,
      roles: roles,
      permissions: permissions
    },
    process.env.JWT_SECRET || 'fallback-secret-12345',
    { expiresIn: '24h' }
  );
};

// @desc    Register a new user (Local)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate request
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Please provide email, password, and role' }
      });
    }

    const trimmedRole = role.trim();
    if (trimmedRole !== 'ROLE_CANDIDAT' && trimmedRole !== 'ROLE_RECRUTEUR') {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Role must be either ROLE_CANDIDAT or ROLE_RECRUTEUR' }
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_EXISTS', message: 'User with this email already exists' }
      });
    }

    // Find the Role
    const dbRole = await Role.findOne({ name: trimmedRole });
    if (!dbRole) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: `Role '${trimmedRole}' has not been initialized` }
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      email,
      passwordHash,
      roles: [dbRole._id]
    });

    // Create empty Profile in the corresponding collection
    if (trimmedRole === 'ROLE_CANDIDAT') {
      await Candidate.create({
        _id: user._id,
        firstName: '',
        lastName: '',
        phone: '',
        employabilityScore: 0.0,
        careerSuggestions: []
      });
    } else {
      await Recruiter.create({
        _id: user._id,
        companyName: '',
        position: '',
        industry: ''
      });
    }

    // Fetch user populated with roles
    const populatedUser = await User.findById(user._id).populate('roles');
    const token = generateToken(populatedUser);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: populatedUser.id,
          email: populatedUser.email,
          roles: populatedUser.roles.map(r => r.name)
        }
      }
    });

  } catch (error) {
    console.error('Error during local registration:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Registration failed due to server error' }
    });
  }
};

// @desc    Login user (Local)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Please provide email and password' }
      });
    }

    // Find user and populate roles
    const user = await User.findOne({ email }).populate('roles');
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' }
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' }
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles.map(r => r.name)
        }
      }
    });

  } catch (error) {
    console.error('Error during local login:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Login failed due to server error' }
    });
  }
};

// @desc    OAuth Callback success handler
// @route   GET /api/auth/oauth-success
// @access  Private (Passport handles redirect here)
const oauthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=auth_failed`);
  }

  // Generate token from the authenticated user
  const token = generateToken(req.user);
  
  // Redirect to frontend landing page with token
  return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth-success?token=${token}`);
};

module.exports = {
  register,
  login,
  oauthSuccess
};
