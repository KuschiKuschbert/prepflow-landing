const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { supabase, getRow } = require('../config/supabase');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  businessName: Joi.string().max(255).optional(),
  businessType: Joi.string().valid('restaurant', 'pub', 'cafe', 'food_truck').optional(),
  country: Joi.string().default('AU'),
  currency: Joi.string().length(3).default('AUD'),
  taxSystem: Joi.string().valid('GST', 'VAT', 'Sales_Tax').default('GST')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message,
          timestamp: new Date().toISOString()
        }
      });
    }

    const { email, password, firstName, lastName, businessName, businessType, country, currency, taxSystem } = value;

    // Check if user already exists
    const existingUser = await getRow('users', { email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      email: email.toLowerCase(),
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      business_name: businessName || null,
      business_type: businessType || null,
      country,
      currency,
      tax_system: taxSystem,
      is_admin: false,
      is_active: true,
      email_verified: false
    };

    // Insert user using direct Supabase call
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(userData)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to create user: ' + insertError.message);
    }

    if (!newUser || newUser.length === 0) {
      throw new Error('Failed to create user - no data returned');
    }

    const createdUser = newUser[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: createdUser.id,
        email: createdUser.email,
        role: 'user'
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          firstName: createdUser.first_name,
          lastName: createdUser.last_name,
          businessName: createdUser.business_name,
          isAdmin: createdUser.is_admin,
          emailVerified: createdUser.email_verified
        },
        token
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to register user',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message,
          timestamp: new Date().toISOString()
        }
      });
    }

    const { email, password } = value;

    // Find user
    const user = await getRow('users', { email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_DEACTIVATED',
          message: 'Account is deactivated',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.is_admin ? 'admin' : 'user'
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          businessName: user.business_name,
          isAdmin: user.is_admin,
          emailVerified: user.email_verified
        },
        token
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to login',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // This endpoint requires authentication middleware
    const user = req.user;

    // Get fresh user data from database
    const userData = await getRow('users', { id: user.id });
    if (!userData) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          timestamp: new Date().toISOString()
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          businessName: userData.business_name,
          businessType: userData.business_type,
          country: userData.country,
          currency: userData.currency,
          taxSystem: userData.tax_system,
          isAdmin: userData.is_admin,
          emailVerified: userData.email_verified,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get user data',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
