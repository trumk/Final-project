const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Project = require('../models/Project');

// Hàm kiểm tra sự tồn tại của ảnh
const checkIfImageExists = (filename) => {
  const filePath = path.join('uploads', filename);
  return fs.existsSync(filePath);
};

// Hàm tạo tên file duy nhất
const generateUniqueFilename = (originalName) => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const uniqueName = `${name}-${Date.now()}${ext}`;
  return uniqueName;
};

// Hàm xóa ảnh khỏi thư mục
const deleteImage = (filename) => {
  const filePath = path.join('uploads', filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error });
  }
};


const getOneProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch the project', error });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, author, description } = req.body;
    const newImages = req.files ? req.files : [];
    let images = [];

    // Xử lý ảnh mới
    for (const file of newImages) {
      const originalName = file.originalname; // Tên file gốc
      const uniqueFilename = generateUniqueFilename(originalName);
      const imagePath = `uploads/${uniqueFilename}`;

      // Nếu ảnh đã tồn tại, bỏ qua việc lưu trữ ảnh mới
      if (!checkIfImageExists(originalName)) {
        fs.renameSync(file.path, imagePath); // Di chuyển file từ temp đến uploads
      } else {
        fs.unlinkSync(file.path); // Xóa file temp nếu đã tồn tại
      }
      images.push(imagePath);
    }

    const newProject = new Project({
      name,
      author,
      description,
      images
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, author, description, likes, removedImages } = req.body;
    const newImages = req.files ? req.files : [];
    let images = [];

    // Xử lý ảnh mới
    for (const file of newImages) {
      const filename = file.filename; // Tên file đã được tạo ra bởi multer
      const imagePath = `uploads/${filename}`;

      // Di chuyển file từ temp đến uploads
      if (!checkIfImageExists(filename)) {
        fs.renameSync(file.path, imagePath);
      } else {
        fs.unlinkSync(file.path); // Xóa file temp nếu đã tồn tại
      }
      images.push(imagePath);
    }

    // Lấy thông tin project cũ
    const oldProject = await Project.findById(req.params.id);

    if (!oldProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Xóa ảnh không còn sử dụng
    const oldImages = oldProject.images;
    for (const oldImage of oldImages) {
      const oldImageFilename = path.basename(oldImage);
      if (!images.includes(`uploads/${oldImageFilename}`)) {
        deleteImage(oldImageFilename); // Xóa ảnh khỏi thư mục uploads
      }
    }

    // Xử lý ảnh đã xóa
    const removedImagesList = JSON.parse(removedImages || '[]');
    removedImagesList.forEach((imagePath) => {
      const filename = path.basename(imagePath);
      deleteImage(filename); // Xóa ảnh khỏi thư mục uploads
    });

    // Cập nhật danh sách ảnh
    images = [...images, ...oldImages.filter(image => !removedImagesList.includes(image))];

    const updateData = {
      name,
      author,
      description,
      likes,
      ...(images.length > 0 && { images })
    };

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error });
  }
};



const deleteProject = async (req, res) => {
  try {
    // Lấy thông tin project trước khi xóa
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Xóa ảnh liên quan
    for (const image of project.images) {
      const imageFilename = path.basename(image);
      deleteImage(imageFilename);
    }

    // Xóa project
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error });
  }
};
  

module.exports = {
    getAllProjects,
    getOneProject,
    createProject,
    updateProject,
    deleteProject
}