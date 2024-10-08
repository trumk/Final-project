const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.uid, isRead: false }).populate('sender', 'userName');
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.uid }, { isRead: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark notifications', error });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
};
