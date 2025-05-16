const express = require('express');
const router = express.Router();
const Metric = require('../models/metricModel');

/**
 * @swagger
 * tags:
 *   name: Webhooks
 *   description: Receive external metric data via webhook
 */

/**
 * @swagger
 * /webhooks/push:
 *   post:
 *     summary: Push a metric value via webhook
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - value
 *             properties:
 *               name:
 *                 type: string
 *                 example: wind_speed
 *               value:
 *                 type: number
 *                 example: 22.5
 *     responses:
 *       201:
 *         description: Metric pushed successfully
 *       400:
 *         description: Metric name and value are required
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */
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
