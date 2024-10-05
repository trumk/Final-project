const Project = require('../models/Project');
const { uploadFileToFirebase } = require('../middleware/firebaseConfig'); 

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
    const { name, authors, description, semester, department, video } = req.body;
    const newImages = req.files ? req.files : [];
    let images = [];

    // Upload new images to Firebase and get their URLs
    for (const file of newImages) {
      const publicUrl = await uploadFileToFirebase(file); // Sử dụng buffer từ file để upload
      images.push(publicUrl); // Add Firebase URL to images array
    }

    // Tạo đối tượng Project mới
    const newProject = new Project({
      name,
      authors: Array.isArray(authors) ? authors : [authors],
      description,
      semester,
      department,
      images, // Store the Firebase image URLs
      video,
    });

    // Lưu project mới vào cơ sở dữ liệu
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    // Ghi lại chi tiết lỗi vào log của server
    console.error('Error creating project:', error);

    // Trả về lỗi chi tiết cho client
    res.status(500).json({ 
      message: 'Failed to create project', 
      error: error.message,   // Thông báo lỗi
      stack: error.stack,     // Stack trace để dễ debug
      details: error          // Toàn bộ đối tượng lỗi
    });
  }
};



const updateProject = async (req, res) => {
  try {
    const { removedImages } = req.body;
    const newImages = req.files ? req.files : [];
    let images = [];

    // Fetch the old project
    const oldProject = await Project.findById(req.params.id);
    if (!oldProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let oldImages = [...oldProject.images]; // Clone old image list

    // Upload new images to Firebase and get their URLs
    for (const file of newImages) {
      const publicUrl = await uploadFileToFirebase(file);
      images.push(publicUrl); // Add new image URLs to array
    }

    // Handle removed images
    const removedImagesList = JSON.parse(removedImages || '[]');
    oldImages = oldImages.filter(image => !removedImagesList.includes(image));
    images = [...oldImages, ...images]; // Combine old and new images

    // Create update data object with only provided fields
    const updateData = {};

    // Only add fields to updateData if they are provided in the request body
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.authors) updateData.authors = Array.isArray(req.body.authors) ? req.body.authors : [req.body.authors];
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.semester) updateData.semester = req.body.semester;
    if (req.body.department) updateData.department = req.body.department;
    if (images.length > 0) updateData.images = images;
    if (req.body.video) updateData.video = req.body.video;

    // Update the project with the new data
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

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
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Xóa từng ảnh khỏi Firebase Storage
    for (const imageUrl of project.images) {
      const fileName = imageUrl.split('/').pop(); // Lấy tên file từ URL của Firebase
      const file = bucket.file(fileName);

      // Kiểm tra xem file có tồn tại trong Firebase Storage không
      const [exists] = await file.exists();
      if (exists) {
        await file.delete(); // Xóa file nếu tồn tại
      }
    }

    // Xóa project khỏi MongoDB
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Project and associated images deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error });
  }
};

module.exports = {
  getAllProjects,
  getOneProject,
  createProject,
  updateProject,
  deleteProject,
};
