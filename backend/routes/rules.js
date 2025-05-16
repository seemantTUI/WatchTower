const express = require('express');

const {
    getRules,
    getRule,
    createRule,
    createRules,
    updateRule,
    deleteRule,
    deleteRules,
    armRule,
} = require('../controllers/rulesController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rules
 *   description: Rule management and alerts
 */

/**
 * @swagger
 * /rules:
 *   get:
 *     summary: Get all rules
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rules
 */
router.get('/', getRules);

/**
 * @swagger
 * /rules/{id}:
 *   get:
 *     summary: Get a rule by ID
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the rule to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rule found
 *       404:
 *         description: Rule not found
 */
router.get('/:id', getRule);

/**
 * @swagger
 * /rules:
 *   post:
 *     summary: Create a new rule
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ruleName
 *               - ruleDescription
 *               - metric
 *               - threshold
 *               - condition
 *               - notificationChannel
 *             properties:
 *               ruleName:
 *                 type: string
 *               ruleDescription:
 *                 type: string
 *               metric:
 *                 type: string
 *               threshold:
 *                 type: number
 *               condition:
 *                 type: string
 *               notificationChannel:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rule created
 */
router.post('/', createRule);

/**
 * @swagger
 * /rules/rules:
 *   post:
 *     summary: Create multiple rules
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rules:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Rules created
 */
router.post('/rules', createRules);

/**
 * @swagger
 * /rules/{id}:
 *   put:
 *     summary: Update a rule
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Rule updated
 */
router.put('/:id', updateRule);

/**
 * @swagger
 * /rules/{id}:
 *   delete:
 *     summary: Delete a rule
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rule deleted
 */
router.delete('/:id', deleteRule);

/**
 * @swagger
 * /rules:
 *   delete:
 *     summary: Delete multiple rules
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Rules deleted
 */
router.delete('/', deleteRules);

/**
 * @swagger
 * /rules/{id}/arm:
 *   patch:
 *     summary: Re-arm a rule
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Rule ID
 *     responses:
 *       200:
 *         description: Rule re-armed
 */
router.patch('/:id/arm', armRule);

module.exports = router;
