const Rule = require('../models/ruleModel')
const mongoose = require('mongoose')


const getRules = async (req, res) => {
    try {
        const rules = await Rule.find({})
            .populate('metric', 'metricName') // Populate metricName
            .sort({ createdAt: -1 });

        res.status(200).json({
            rules: {
                count: rules.length,
                items: rules,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific rule by ID
const getRule = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: `Rule with ID ${id} does not exist` });
    }

    try {
        const rule = await Rule.findById(id).populate('metric', 'metricName');
        if (!rule) {
            return res.status(404).json({ error: `Rule with ID ${id} does not exist` });
        }

        res.status(200).json(rule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createRule = async (req, res) => {
    const { ruleName, 
            ruleDescription, 
            metric, 
            condition, 
            threshold, 
            notificationChannel} = req.body
            
    let missingFields = []
    if(!ruleName){ missingFields.push(ruleName)}
    if(!ruleDescription){ missingFields.push(ruleDescription)}
    if(!metric){missingFields.push(metric)}
    if(!condition){missingFields.push(condition)}
    if(!threshold){missingFields.push(threshold)}
    if(!notificationChannel){missingFields.push(notificationChannel)}
    if(missingFields.length > 0)    {
        return req.status(400).json ({error: 'Please fill in all the fields', emptyFields })
    }
    try {
        const rule  =  await Rule.create({ruleName, 
            ruleDescription, 
            metric, 
            condition, 
            threshold, 
            notificationChannel})
        res.status(201).json(rule);
    } catch (error){
        res.status(400).json({ error: error.message })
    }

};

const createRules = async (req, res) => {
    const { rules } = req.body; 

    if (!Array.isArray(rules) || rules.length === 0) {
        return res.status(400).json({ error: 'No rules provided or invalid format' });
    }

    const invalidRules = [];
    const validRules = [];

    // Validate each rule in the array
    rules.forEach((rule, index) => {
        const { ruleName, ruleDescription, metric, condition, threshold, notificationChannel } = rule;
        const missingFields = [];

        if (!ruleName) missingFields.push('ruleName');
        if (!ruleDescription) missingFields.push('ruleDescription');
        if (!metric) missingFields.push('metric');
        if (!condition) missingFields.push('condition');
        if (!threshold) missingFields.push('threshold');
        if (!notificationChannel) missingFields.push('notificationChannel');

        if (missingFields.length > 0) {
            invalidRules.push({ index, missingFields });
        } else {
            validRules.push(rule);
        }
    });

    if (invalidRules.length > 0) {
        return res.status(400).json({
            error: 'Some rules are missing required fields',
            invalidRules,
        });
    }

    try {
        const createdRules = await Rule.insertMany(validRules);
        res.status(201).json({ message: 'Rules created successfully', createdRules });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateRule = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: `Rule with ${id} does not exist` });
    }
    try {
        const rule = await Rule.findOneAndUpdate({_id: id}, {...req.body})
        if (!rule){
            return res.status(404).json({ error: `Rule with ${id} does not exist` });
        }
        return res.status(200).json(rule)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
    
    
};

const deleteRule = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: `Rule with ${id} does not exist` });
    }
    try {
        const rule = await Rule.findOneAndDelete({_id: id})
        if (!rule){
        return res.status(404).json({ error: `Rule with ${id} does not exist` });
    }
    return res.status(200).json(rule)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

const deleteRules = async (req, res) => {
    const { ids } = req.body; // Assume `ids` is an array of rule IDs to be deleted

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'No IDs provided or invalid format' });
    }

    // Check if all IDs are valid
    const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
        return res.status(400).json({ error: `Invalid IDs: ${invalidIds.join(', ')}` });
    }

    try {
        const result = await Rule.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No rules found to delete' });
        }
        return res.status(200).json({ message: `Deleted ${result.deletedCount} rules successfully` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRules,
    getRule,
    createRule,
    createRules,
    updateRule,
    deleteRule,
    deleteRules,
};