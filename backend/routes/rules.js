const express = require('express')

const {getRules,
    getRule,
    createRule,
    createRules,
    updateRule,
    deleteRule,
    deleteRules   
    } = require('../controllers/rulesController')

const router = express.Router()




//get all rules

router.get('/', getRules)

//get a single rule
router.get('/:id', getRule)

//post a rule
router.post('/', createRule)

//post multiple rules
router.post('/rules', createRules)

//patch a rule
router.put('/:id', updateRule)

//delete a rule 
router.delete('/:id', deleteRule)

//delete multiple rules
router.delete('/', deleteRules)

module.exports = router;
