const express = require("express");
const multer = require("multer");
const { getAllUser, getOneUser, updateProfile } = require("../controllers/userController");
const middleware = require('../middleware/firebaseConfig');
const { getNotifications, markNotificationAsRead } = require("../controllers/notificationController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getAllUser); 
router.get("/:id", getOneUser); 
router.put('/:id', upload.single('avatar'), updateProfile);

// Notification routes
router.get('/:id/notifications', middleware.verifyFirebaseToken, getNotifications);
router.put('/:id/notifications/read', middleware.verifyFirebaseToken, markNotificationAsRead);

module.exports = router;
