const Notifications = require('../models/notificationModel')

const getNotifications = async (req, res) =>{
    try {
        const notifications = await Notification.find({}).sort({createdAt: -1})
        const count = notifications.length;

        res.status(200).json({
            notifications: {
                count,
                items: notifications,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {getNotifications};