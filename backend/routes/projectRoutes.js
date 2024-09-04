const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/getAllProjects', projectController.getAllProjects);

router.get('/:id', projectController.getOneProject);

router.post('/', projectController.createProject);

router.put('/:id', projectController.updateProject);

router.delete('/:id', projectController.deleteProject);

module.exports = router;
