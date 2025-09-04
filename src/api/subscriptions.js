const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/current', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Subscriptions API not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

router.post('/create', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Subscriptions API not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

router.post('/cancel', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Subscriptions API not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
