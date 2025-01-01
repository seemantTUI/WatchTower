const express = require('express')

const {getMetrics,
    getMetric,
    createMetric,
    createMetrics,
    updateMetric,
    deleteMetric,
    deleteMetrics   
    } = require('../controllers/metricsController')

const router = express.Router()


router.get('/', getMetrics)

router.get('/:id', getMetric)

//post a rule
router.post('/', createMetric)

router.post('/metrics', createMetrics)

//patch a rule
router.put('/:id', updateMetric)

router.delete('/:id', deleteMetric)

router.delete('/', deleteMetrics)

module.exports = router;
