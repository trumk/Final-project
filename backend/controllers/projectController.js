const Project = require('../models/Project');

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

    // Lấy đường dẫn file và thay backslash bằng forward slash
    const images = req.files.map(file => file.path.replace(/\\/g, '/'));

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
    const { name, author, description, images, likes } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name, author, description, images, likes },
      { new: true }
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
      const deletedProject = await Project.findByIdAndDelete(req.params.id);
  
      if (!deletedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json({ 
        message: 'Project deleted successfully', 
        project: deletedProject
      });
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