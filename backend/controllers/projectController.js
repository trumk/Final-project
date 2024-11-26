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
    const { name, authors, description, semester, department, video } = req.body;

    if (!name || !authors || !description || !semester || !department) {
      return res.status(400).json({ message: "Please fill in required fields" });
    }

    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: "Project name already exists" });
    }

    const newImages = req.files.images || [];
    const reportFiles = req.files.reports || [];
    let images = [];
    let reports = [];

    for (const file of newImages) {
      const publicUrl = await uploadFileToFirebase(file);
      images.push(publicUrl);
    }

    for (const file of reportFiles) {
      const reportUrl = await uploadFileToFirebase(file);
      reports.push(reportUrl);
    }

    const newProject = new Project({
      name,
      authors: Array.isArray(authors) ? authors : [authors],
      description,
      semester,
      department,
      images,
      video,
      reports,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project", error });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, authors, description, semester, department, removedImages, removedReports } = req.body;

    if (!name || !authors || !description || !semester || !department) {
      return res.status(400).json({ message: "Please fill in required fields" });
    }
    
    const existingProject = await Project.findOne({ name, _id: { $ne: req.params.id } });
    if (existingProject) {
      return res.status(400).json({ message: "Project name already exists" });
    }

    const newImages = req.files.images || [];
    const newReports = req.files.reports || [];
    let images = [];
    let reports = [];

    const oldProject = await Project.findById(req.params.id);
    if (!oldProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    let oldImages = [...oldProject.images];
    let oldReports = [...oldProject.reports];

    for (const file of newImages) {
      const publicUrl = await uploadFileToFirebase(file);
      images.push(publicUrl);
    }

    const removedImagesList = JSON.parse(removedImages || "[]");
    for (const imageUrl of removedImagesList) {
      await deleteFileFromFirebase(imageUrl);
    }
    oldImages = oldImages.filter((image) => !removedImagesList.includes(image));
    images = [...oldImages, ...images];

    const removedReportsList = JSON.parse(removedReports || "[]");
    for (const reportUrl of removedReportsList) {
      await deleteFileFromFirebase(reportUrl);
    }
    oldReports = oldReports.filter((report) => !removedReportsList.includes(report));

    for (const file of newReports) {
      const reportUrl = await uploadFileToFirebase(file);
      reports.push(reportUrl);
    }
    reports = [...oldReports, ...reports];

    const updateData = {
      ...req.body,
      images,
      reports,
    };

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update project", error });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    for (const imageUrl of project.images) {
      const fileName = imageUrl.split("/").pop().split("?")[0];
      const file = bucket.file(fileName);

      const [exists] = await file.exists();
      if (exists) {
        await file.delete();
      }
    }

    for (const reportUrl of project.reports) {
      const reportFileName = reportUrl.split("/").pop().split("?")[0];
      const reportFile = bucket.file(reportFileName);

      const [exists] = await reportFile.exists();
      if (exists) {
        await reportFile.delete();
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project and associated images/reports deleted successfully" });
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
        if (admin._id.toString() !== senderId.toString()) {
          const notification = new Notification({
            recipient: admin._id,
            sender: senderId,
            project: project._id,
            type: "like",
            message: `${senderUser.userName} liked project "${project.name}".`,
          });
          await notification.save();
        }
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

const deleteCommentAndReplies = async (commentId) => {
  const replies = await Comment.find({ parentId: commentId });
  
  for (const reply of replies) {
    await deleteCommentAndReplies(reply._id); 
  }
  
  await Comment.findByIdAndDelete(commentId);
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user?.uid || req.body.userId || req.cookies.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await deleteCommentAndReplies(commentId);

    const project = await Project.findById(comment.projectId);
    if (project) {
      project.comments = project.comments.filter((id) => id.toString() !== commentId);
      await project.save();
    }

    res.status(200).json({ message: "Comment and all replies deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment", error });
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

const getProjectByDepartment = async (req, res) => {
  try {
    const projectCounts = await Project.aggregate([
      {
        $group: {
          _id: "$department",
          projectCount: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(projectCounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to get project counts by department", error });
  }
};

const getLikeByDepartment = async (req, res) => {
  try {
    const likeCounts = await Project.aggregate([
      {
        $group: {
          _id: "$department",
          totalLikes: { $sum: "$likes" },
        },
      },
    ]);
    res.status(200).json(likeCounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to get like counts by department", error });
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
  deleteComment,
  getCommentsByProject,
  getAllComments,
  likeProject,
  searchProjects,
  sortProjects,
  filterProjects,
  getProjectByDepartment,
  getLikeByDepartment
};
