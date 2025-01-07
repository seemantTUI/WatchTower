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
    metric: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Metric',
        required: true,
    },
    alertMessage: {
        type: String,
        required: false,
        default: function () {
            return `Alert! ${this.ruleName} has been breached.`;
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('Rule', RuleSchema);
