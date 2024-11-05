const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const middleware = require('../middleware/firebaseConfig');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Action routes
router.get('/search', projectController.searchProjects); 
router.get('/sort', projectController.sortProjects); 
router.get('/filter', projectController.filterProjects); 

// Comment routes 
router.get('/comments', projectController.getAllComments); 
router.post('/:projectId/comments', middleware.verifyFirebaseToken, projectController.addComment);
router.get('/:projectId/comments', projectController.getCommentsByProject);

// CRUD for Projects
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getOneProject); 
router.put('/:id', upload.array('images', 5), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/', upload.array('images', 5), projectController.createProject);

// Like routes
router.post('/:projectId/like', middleware.verifyFirebaseToken, projectController.likeProject);

module.exports = router;
