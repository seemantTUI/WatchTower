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
    isArmed: {
        type: Boolean,
        default: true,
    },

    retriggerAfter: {
        type: String, // format: '1d2h30m', optional
        required: false,
    },

    lastTriggeredAt: {
        type: Date,
        required: false,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

RuleSchema.virtual('notifications', {
    ref: 'Notifications',
    localField: '_id',
    foreignField: 'ruleId',
    options: { sort: { createdAt: -1 } }  // newest first
});

RuleSchema.set('toObject', { virtuals: true });
RuleSchema.set('toJSON',   { virtuals: true });

module.exports = mongoose.model('Rule', RuleSchema);
