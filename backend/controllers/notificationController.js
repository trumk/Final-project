const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const notifications = await Notification.find({ 
      recipient: userId 
    }).populate('sender', 'userName'); 

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.params.id; 

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }


    await Notification.updateMany({ recipient: userId }, { isRead: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark notifications', error });
  }
};

const clearNotifications = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    await Notification.deleteMany({ recipient: userId });
    res.status(200).json({ message: 'All notifications cleared successfully' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ message: 'Failed to clear notifications', error });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  clearNotifications
};
