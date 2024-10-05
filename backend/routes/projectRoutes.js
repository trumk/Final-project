const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const multer = require('multer');

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// CRUD
router.get('/', projectController.getAllProjects); 
router.get('/:id', projectController.getOneProject); 
router.put('/:id', upload.array('images', 5), projectController.updateProject); 
router.delete('/:id', projectController.deleteProject); 
router.post('/', upload.array('images', 5), projectController.createProject); 

module.exports = router;
