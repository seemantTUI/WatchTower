const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RuleSchema = new Schema({
    ruleName: {
        type: String,
        required: true,
    },
    ruleDescription: {
        type: String,
        required: true,
    },
    metricName: {
        type: String,
        required: true,
    },
    threshold: {
        type: Number,
        required: true,
    },
    condition: {
        type: String,
        enum: ['greater', 'less'],
        required: true,
    },
    notificationChannel: {
        type: String,
        enum: ['email', 'sms', 'webhook'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Rule', RuleSchema);
