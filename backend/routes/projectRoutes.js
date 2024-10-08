const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const notificationController = require('../controllers/notificationController');
const middleware = require('../middleware/firebaseConfig');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// CRUD for Projects
router.get('/', projectController.getAllProjects); 
router.get('/:id', projectController.getOneProject); 
router.put('/:id', upload.array('images', 5), projectController.updateProject); 
router.delete('/:id', projectController.deleteProject); 
router.post('/', upload.array('images', 5), projectController.createProject); 

// Comment routes under project scope (RESTful)
router.post('/:projectId/comments', middleware.verifyFirebaseToken, projectController.addComment);
router.get('/:projectId/comments', projectController.getCommentsByProject);

// Notification routes
router.get('/notifications', middleware.verifyFirebaseToken, notificationController.getNotifications);
router.put('/notifications/read', middleware.verifyFirebaseToken, notificationController.markNotificationAsRead);

// Like routes
router.post('/:projectId/like', middleware.verifyFirebaseToken, projectController.likeProject);

module.exports = router;
