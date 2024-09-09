const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const multer = require('multer');
const Project = require('../models/Project'); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Thư mục lưu trữ ảnh
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Tạo tên file duy nhất
    }
  });
  
  const upload = multer({ storage: storage });
  
  // CRUD
  router.get('/', projectController.getAllProjects); 
  router.get('/:id', projectController.getOneProject); 
  router.put('/:id', upload.array('images', 5), projectController.updateProject);
  router.delete('/:id', projectController.deleteProject); 
  router.post('/', upload.array('images', 5), projectController.createProject);
  
  module.exports = router;