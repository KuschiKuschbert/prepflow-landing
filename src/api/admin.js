const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/users', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Admin API not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

router.post('/impersonate/:userId', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Admin API not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
