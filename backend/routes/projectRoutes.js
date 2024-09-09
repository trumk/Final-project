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
  
  // Các route CRUD cơ bản
  router.get('/', projectController.getAllProjects); // Lấy tất cả các project
  router.get('/:id', projectController.getOneProject); // Lấy 1 project theo id
  router.put('/:id', projectController.updateProject); // Cập nhật project theo id
  router.delete('/:id', projectController.deleteProject); // Xóa project theo id
  
  // Route tạo project với upload nhiều ảnh
  router.post('/', upload.array('images', 5), projectController.createProject);
  
  module.exports = router;