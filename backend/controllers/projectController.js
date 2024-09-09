const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Project = require('../models/Project');

// Hàm kiểm tra sự tồn tại của ảnh
const checkIfImageExists = (filename) => {
  const filePath = path.join('uploads', filename);
  return fs.existsSync(filePath);
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
      const imagePath = `uploads/${originalName}`; // Đường dẫn đầy đủ đến file

      // Nếu ảnh đã tồn tại, xóa ảnh trùng trong thư mục uploads
      if (checkIfImageExists(originalName)) {
        deleteImage(originalName); // Xóa ảnh trùng trong thư mục uploads
      }

      // Di chuyển file từ temp đến uploads
      fs.renameSync(file.path, imagePath);
      images.push(imagePath);
    }

    const newProject = new Project({
      name,
      author,
      description,
      images,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error });
  }
};


const updateProject = async (req, res) => {
  try {
    const { name, author, description, removedImages } = req.body;
    const newImages = req.files ? req.files : [];
    let images = [];
    console.log(newImages)
    // Lấy thông tin project cũ
    const oldProject = await Project.findById(req.params.id);
    if (!oldProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let oldImages = [...oldProject.images]; // Clone danh sách ảnh cũ

    // Xử lý ảnh mới
    for (const file of newImages) {
      const filename = file.filename;
      const imagePath = `uploads/${filename}`;
      const oldImageIndex = oldImages.findIndex(oldImage => path.basename(oldImage) === filename);

      // Nếu ảnh mới trùng với ảnh cũ thì thay thế ảnh cũ bằng ảnh mới
      if (oldImageIndex !== -1) {
        // Xóa ảnh cũ trong thư mục uploads
        deleteImage(path.basename(oldImages[oldImageIndex]));
        // Thay thế ảnh cũ bằng ảnh mới
        oldImages[oldImageIndex] = imagePath;
      } else {
        // Di chuyển ảnh mới nếu không trùng với ảnh cũ
        if (!checkIfImageExists(filename)) {
          fs.renameSync(file.path, imagePath);
        } else {
          fs.unlinkSync(file.path); // Xóa file temp nếu đã tồn tại
        }
        // Thêm ảnh mới vào danh sách
        images.push(imagePath);
      }
    }

    // Xử lý ảnh đã xóa (từ yêu cầu phía client)
    const removedImagesList = JSON.parse(removedImages || '[]');
    oldImages = oldImages.filter(image => !removedImagesList.includes(image)); // Loại bỏ ảnh đã bị xóa khỏi danh sách cũ

    // Gộp danh sách ảnh cũ và ảnh mới
    images = [...oldImages, ...images];
    console.log(oldImages)


    console.log(images)

    const updateData = {
      name,
      author,
      description,
      images, // Cập nhật lại danh sách ảnh mới
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