const jwt = require('jsonwebtoken');
const { getRow } = require('../config/supabase');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token required',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await getRow('users', { id: decoded.sub });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User account is deactivated',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      businessName: user.business_name,
      isAdmin: user.is_admin,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token',
          timestamp: new Date().toISOString()
        }
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token expired',
          timestamp: new Date().toISOString()
        }
      });
    }

    next(error);
  }
};

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required',
        timestamp: new Date().toISOString()
      }
    });
  }
  next();
};

// User data isolation middleware
const userDataMiddleware = (req, res, next) => {
  req.userId = req.user.id;
  next();
};

// Impersonation middleware
const handleImpersonation = async (req, res, next) => {
  try {
    // Check if this is an impersonation session
    if (req.user.role === 'impersonated_user' && req.user.adminId) {
      // Log the action for audit purposes
      await logImpersonationAction(req.user.impersonationId, req.method, req.originalUrl);
      
      // Add impersonation context to request
      req.isImpersonation = true;
      req.originalAdminId = req.user.adminId;
      req.impersonationId = req.user.impersonationId;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Helper function to log impersonation actions
const logImpersonationAction = async (impersonationId, action, details) => {
  try {
    const { update } = require('../config/supabase');
    await update('impersonation_logs', 
      { 
        actions_performed: JSON.stringify({ action, details, timestamp: new Date().toISOString() })
      }, 
      { id: impersonationId }
    );
  } catch (error) {
    console.error('Failed to log impersonation action:', error);
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  userDataMiddleware,
  handleImpersonation
};
