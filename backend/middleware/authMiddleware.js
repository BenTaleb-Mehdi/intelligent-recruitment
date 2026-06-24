const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-12345');
      
      req.user = {
        id: decoded.userId,
        userId: decoded.userId,
        role: decoded.role,
        roles: decoded.roles || [decoded.role],
        permissions: decoded.permissions || []
      };
      
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authorized, token invalid or expired' }
      });
    }
  }

  return res.status(401).json({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Not authorized, no token provided' }
  });
};

const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: `Access denied: requires permission '${permission}'` }
      });
    }
    next();
  };
};

module.exports = { protect, hasPermission };
