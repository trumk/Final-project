const Project = require('../models/Project');
const { uploadFileToFirebase } = require('../middleware/firebaseConfig'); 
const { bucket } = require('../middleware/firebaseConfig'); 
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

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

    for (const file of newImages) {
      const publicUrl = await uploadFileToFirebase(file); 
      console.log(publicUrl)
      images.push(publicUrl); 
    }

   

    const newProject = new Project({
      name,
      authors: Array.isArray(authors) ? authors : [authors],
      description,
      semester,
      department,
      images, 
      video,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);

    res.status(500).json({ 
      message: 'Failed to create project', 
      error: error.message,  
      stack: error.stack,    
      details: error         
    });
  }
};



const updateProject = async (req, res) => {
  try {
    const { removedImages } = req.body;
    const newImages = req.files ? req.files : [];
    let images = [];

    const oldProject = await Project.findById(req.params.id);
    if (!oldProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let oldImages = [...oldProject.images]; 

    for (const file of newImages) {
      const publicUrl = await uploadFileToFirebase(file);
      images.push(publicUrl); 
    }

    const removedImagesList = JSON.parse(removedImages || '[]');
    oldImages = oldImages.filter(image => !removedImagesList.includes(image));
    images = [...oldImages, ...images]; 

    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.authors) updateData.authors = Array.isArray(req.body.authors) ? req.body.authors : [req.body.authors];
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.semester) updateData.semester = req.body.semester;
    if (req.body.department) updateData.department = req.body.department;
    if (images.length > 0) updateData.images = images;
    if (req.body.video) updateData.video = req.body.video;

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
    console.log("Starting project deletion process for ID:", req.params.id);

    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log("Project not found for ID:", req.params.id);
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log("Project found:", project);

    for (const imageUrl of project.images) {
      const fileName = imageUrl.split('/').pop().split('?')[0]; 
      console.log("Attempting to delete image file:", fileName);

      const file = bucket.file(fileName);

      const [exists] = await file.exists();
      if (exists) {
        console.log("File exists, deleting file:", fileName);
        await file.delete(); 
        console.log("File deleted:", fileName);
      } else {
        console.log("File not found:", fileName);
      }
    }

    console.log("Deleting project from database with ID:", req.params.id);
    await Project.findByIdAndDelete(req.params.id); 

    console.log("Project deleted successfully");
    res.status(200).json({ message: 'Project and associated images deleted successfully' });
  } catch (error) {
    console.error("Error during project deletion:", error);
    res.status(500).json({ message: 'Failed to delete project', error });
  }
};

const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Kiểm tra req.user tồn tại hay không
    if (!req.user || (!req.user.uid && !req.user._id)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const senderId = req.user.uid || req.user._id; // Dùng uid cho Firebase hoặc _id cho người dùng thường

    // Kiểm tra xem người dùng đã like dự án trước đó hay chưa
    const hasLiked = project.likedUsers.includes(senderId);

    if (hasLiked) {
      // Nếu đã like thì dislike (trừ đi 1)
      project.likes -= 1;
      project.likedUsers = project.likedUsers.filter(user => user.toString() !== senderId.toString());
    } else {
      // Nếu chưa like thì thêm like
      project.likes += 1;
      project.likedUsers.push(senderId);

      // Tạo thông báo like nếu người dùng chưa like trước đó
      const notification = new Notification({
        recipient: project.authors[0], 
        sender: senderId, 
        project: project._id,
        type: 'like',
      });
      await notification.save();
    }

    await project.save();

    res.status(200).json({ message: hasLiked ? 'Project disliked successfully' : 'Project liked successfully', likes: project.likes });
  } catch (error) {
    console.error('Error liking project:', error);
    res.status(500).json({ message: 'Failed to like/dislike project', error });
  }
};

const addComment = async (req, res) => {
  try {
    const { comment, parentId } = req.body;

    // Kiểm tra req.user tồn tại hay không
    if (!req.user || (!req.user.uid && !req.user._id)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const senderId = req.user.uid || req.user._id; // Dùng uid cho Firebase hoặc _id cho người dùng thường

    const newComment = new Comment({
      projectId: req.params.projectId,
      userId: senderId, 
      comment,
      parentId: parentId || null,
    });

    await newComment.save();

    const project = await Project.findById(req.params.projectId);
    project.comments.push(newComment._id);
    await project.save();

    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (parentComment) {
        const notification = new Notification({
          recipient: parentComment.userId,
          sender: senderId,
          comment: newComment._id,
          type: 'reply',
        });
        await notification.save();
      }
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment', error });
  }
};

const getCommentsByProject = async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId }).populate('userId', 'userName');
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments', error });
  }
};

module.exports = {
  getAllProjects,
  getOneProject,
  createProject,
  updateProject,
  deleteProject,
  addComment,
  getCommentsByProject,
  likeProject
};
