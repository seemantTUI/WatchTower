const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    ruleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Rule' 
    },
    message: { 
        type: String, 
        required: true 
    },
}, {timestamps: true})

module.exports = mongoose.model('Notifications', NotificationSchema);