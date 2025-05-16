const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    notificationChannel: {
        type: String,
        enum: ['email', 'sms', 'webhook'],
        default: 'email'
    },
    telephone: {
        type: String,
        validate: {
            validator: function (value) {
                if (this.notificationChannel === 'sms') {
                    return !!value; // must be truthy if channel is sms
                }
                return true; // not required otherwise
            },
            message: 'Telephone number is required when notification channel is SMS.'
        }
    },
    webhookUrl: {
        type: String,
        validate: {
            validator: function (value) {
                if (this.notificationChannel === 'webhook') {
                    return !!value;
                }
                return true;
            },
            message: 'Webhook URL is required when notification channel is webhook.'
        }
    }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
