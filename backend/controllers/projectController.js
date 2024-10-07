const Project = require('../models/Project');
const { uploadFileToFirebase } = require('../middleware/firebaseConfig'); 
const { bucket } = require('../middleware/firebaseConfig'); 

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


module.exports = {
  getAllProjects,
  getOneProject,
  createProject,
  updateProject,
  deleteProject,
};
