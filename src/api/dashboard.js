const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/metrics', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Dashboard API not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

router.get('/charts', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Dashboard API not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
