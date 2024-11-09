const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const middleware = require('../middleware/firebaseConfig');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/search', projectController.searchProjects); 
router.get('/sort', projectController.sortProjects); 
router.get('/filter', projectController.filterProjects); 

router.get('/comments', projectController.getAllComments); 
router.post('/:projectId/comments', middleware.verifyFirebaseToken, projectController.addComment);
router.get('/:projectId/comments', projectController.getCommentsByProject);
router.delete('/comments/:id', middleware.verifyFirebaseToken, projectController.deleteComment); 

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getOneProject); 
router.get('/admin/:id', projectController.getOneProjectForAdmin); 
router.put('/:id', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'report', maxCount: 2 }]),projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'report', maxCount: 2 }]), projectController.createProject);

router.post('/:projectId/like', middleware.verifyFirebaseToken, projectController.likeProject);

router.get('/department/projects', projectController.getProjectByDepartment); 
router.get('/department/likes', projectController.getLikeByDepartment);       

module.exports = router;
