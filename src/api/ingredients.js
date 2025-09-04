const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Ingredients API not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

router.post('/', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Ingredients API not yet implemented',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
