const Project = require("../models/Project");
const { uploadFileToFirebase } = require("../middleware/firebaseConfig");
const { bucket } = require("../middleware/firebaseConfig");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const User = require("../models/User");

const deleteFileFromFirebase = async (fileUrl) => {
  try {
    const fileName = decodeURIComponent(fileUrl.split("/o/")[1].split("?")[0]);
    const file = bucket.file(fileName);

    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
      console.log(`Deleted file from Firebase: ${fileName}`);
    } else {
      console.log(`File not found in Firebase: ${fileName}`);
    }
  } catch (error) {
    console.error("Error deleting file from Firebase:", error);
    throw new Error("Failed to delete file from Firebase");
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};

const getOneProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.query.userId; 

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (userId && !project.viewedByUsers.includes(userId)) {
      project.views += 1;
      project.viewedByUsers.push(userId);
      await project.save();
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the project", error });
  }
};

const getOneProjectForAdmin = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId); 

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the project", error });
  }
};


const createProject = async (req, res) => {
  try {
    const { name, authors, description, semester, department, video } =
      req.body;
    const newImages = req.files ? req.files : [];
    let images = [];

    for (const file of newImages) {
      const publicUrl = await uploadFileToFirebase(file);
      console.log(publicUrl);
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
    console.error("Error creating project:", error);

    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
      stack: error.stack,
      details: error,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    console.log("Received request:", req.body);
    console.log("Files received:", req.files);

    const { removedImages } = req.body;
    const newImages = req.files ? req.files : [];
    let images = [];

    // Lấy dự án cũ
    const oldProject = await Project.findById(req.params.id);
    if (!oldProject) {
      console.log("Project not found:", req.params.id);
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Old project images:", oldProject.images);

    let oldImages = [...oldProject.images];

    // Tải lên ảnh mới lên Firebase
    for (const file of newImages) {
      const publicUrl = await uploadFileToFirebase(file);
      console.log("Uploaded new image:", publicUrl);
      images.push(publicUrl);
    }

    // Loại bỏ ảnh đã yêu cầu xóa khỏi Firebase
    const removedImagesList = JSON.parse(removedImages || "[]");
    console.log("Images to remove:", removedImagesList);

    for (const imageUrl of removedImagesList) {
      console.log("Attempting to delete image:", imageUrl);
      await deleteFileFromFirebase(imageUrl);
      console.log("Deleted image from Firebase:", imageUrl);
    }

    // Cập nhật danh sách ảnh còn lại
    oldImages = oldImages.filter((image) => !removedImagesList.includes(image));
    images = [...oldImages, ...images];
    console.log("Updated images list:", images);

    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.authors)
      updateData.authors = Array.isArray(req.body.authors)
        ? req.body.authors
        : [req.body.authors];
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.semester) updateData.semester = req.body.semester;
    if (req.body.department) updateData.department = req.body.department;
    if (images.length > 0) updateData.images = images;
    if (req.body.video) updateData.video = req.body.video;

    console.log("Updating project with data:", updateData);

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProject) {
      console.log("Project not found after update:", req.params.id);
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Project updated successfully:", updatedProject);
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update project", error });
  }
};

const deleteProject = async (req, res) => {
  try {
    console.log("Starting project deletion process for ID:", req.params.id);

    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log("Project not found for ID:", req.params.id);
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Project found:", project);

    for (const imageUrl of project.images) {
      const fileName = imageUrl.split("/").pop().split("?")[0];
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
    res
      .status(200)
      .json({ message: "Project and associated images deleted successfully" });
  } catch (error) {
    console.error("Error during project deletion:", error);
    res.status(500).json({ message: "Failed to delete project", error });
  }
};

const likeProject = async (req, res) => {
  try {
    const { userId } = req.body;
    const senderId = req.user?.uid || userId;

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const senderUser = await User.findById(senderId);
    if (!senderUser) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const hasLiked = project.likedUsers.includes(senderId);

    if (!hasLiked) {
      project.likes += 1;
      project.likedUsers.push(senderId);

      const adminUsers = await User.find({ role: 'admin' });
      
      for (const admin of adminUsers) {
        const notification = new Notification({
          recipient: admin._id,
          sender: senderId,
          project: project._id,
          type: "like",
          message: `${senderUser.userName} liked project "${project.name}".`,
        });
        await notification.save();
      }
    } else {
      project.likes -= 1;
      project.likedUsers = project.likedUsers.filter(
        (user) => user.toString() !== senderId.toString()
      );
    }

    await project.save();
    res.status(200).json({
      message: hasLiked
        ? "Project disliked successfully"
        : "Project liked successfully",
      likes: project.likes,
    });
  } catch (error) {
    console.error("Error liking project:", error);
    res.status(500).json({ message: "Failed to like/dislike project", error });
  }
};

const addComment = async (req, res) => {
  try {
    const { comment, parentId, userId } = req.body;
    if (!req.user && !userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const senderId = req.user?.uid || userId;

    const senderUser = await User.findById(senderId);
    if (!senderUser) {
      return res.status(404).json({ message: "Sender not found" });
    }

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
      if (parentComment && parentComment.userId.toString() !== senderId) {
        const notification = new Notification({
          recipient: parentComment.userId,
          sender: senderId,
          comment: newComment._id,
          type: "reply",
          message: `${senderUser.userName} replied to your comment.`,
        });
        await notification.save();
      }
    } else {
      const adminUsers = await User.find({ role: 'admin' });
      for (const admin of adminUsers) {
        if (admin._id.toString() !== senderId) { 
          const notification = new Notification({
            recipient: admin._id,
            sender: senderId,
            project: project._id,
            type: "comment",
            message: `${senderUser.userName} commented on project "${project.name}".`,
          });
          await notification.save();
        }
      }
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment", error });
  }
};

const getCommentsByProject = async (req, res) => {
  try {
    const comments = await Comment.find({
      projectId: req.params.projectId,
    }).populate("userId", "userName avatar"); 
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments", error });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).populate("userId", "userName");
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching all comments:", error);
    res.status(500).json({ message: "Failed to fetch all comments", error });
  }
};

const searchProjects = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { authors: { $regex: search, $options: "i" } },
      ],
    };

    const projects = await Project.find(filter);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to search projects", error });
  }
};

const sortProjects = async (req, res) => {
  try {
    const { sort } = req.query;

    if (!sort) {
      return res.status(400).json({ message: "Sort query is required" });
    }

    let sortOption = {};

    if (sort === "likes") {
      sortOption.likes = -1;
    } else if (sort === "alphabetical") {
      sortOption.name = 1;
    } else {
      return res.status(400).json({ message: "Invalid sort option" });
    }

    const projects = await Project.find().sort(sortOption);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to sort projects", error });
  }
};

const filterProjects = async (req, res) => {
  try {
    const { semester, department } = req.query;

    let filter = {};

    if (semester) {
      filter.semester = semester;
    }

    if (department) {
      filter.department = department;
    }

    const projects = await Project.find(filter);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to filter projects", error });
  }
};

module.exports = {
  getAllProjects,
  getOneProject,
  getOneProjectForAdmin,
  createProject,
  updateProject,
  deleteProject,
  addComment,
  getCommentsByProject,
  getAllComments,
  likeProject,
  searchProjects,
  sortProjects,
  filterProjects,
};
