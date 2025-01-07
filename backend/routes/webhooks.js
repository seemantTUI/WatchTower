const express = require('express');
const router = express.Router();
const Metric = require('../models/metricModel');

// Webhook endpoint for metrics
router.post('/push', async (req, res) => {
  try {
    const { name, value } = req.body;
    if (!name || value === undefined) {
      return res.status(400).json({ error: 'Metric name and value are required' });
    }

    const metric = new Metric({ name, value });
    await metric.save();
    res.status(201).json({ message: 'Metric pushed successfully', metric });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
