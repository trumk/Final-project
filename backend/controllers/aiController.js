const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatHistory = require("../models/ChatHistory");
const Project = require("../models/Project");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function saveUserMessage(userId, message) {
  let chatHistory = await ChatHistory.findOne({ userId });
  if (!chatHistory) {
    chatHistory = new ChatHistory({ userId, messages: [] });
  }
  chatHistory.messages.push({ sender: "user", message });
  await chatHistory.save();
}

async function saveAiMessage(userId, message) {
  const chatHistory = await ChatHistory.findOne({ userId });
  if (chatHistory) {
    chatHistory.messages.push({ sender: "ai", message });
    await chatHistory.save();
  }
}

async function getChatHistory(userId) {
  const chatHistory = await ChatHistory.findOne({ userId });
  return chatHistory ? chatHistory.messages : [];
}

const generatePrompt = async (req, res) => {
  try {
    const userId = req.body.userId;
    const userPrompt = req.body.prompt;

    if (!userId) {
      return res.status(401).json({ message: "User is not authenticated." });
    }
    if (!userPrompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const allowedKeywords = ["project", "comment", "comments", "compare", "rate", "evaluate", "description", "about", "views", "view"];
    const isRelevant = allowedKeywords.some(keyword => userPrompt.toLowerCase().includes(keyword));

    if (!isRelevant) {
      const aiResponse = "Sorry, I can only answer questions about this website's projects.";
      await saveUserMessage(userId, userPrompt);
      await saveAiMessage(userId, aiResponse);
      return res.status(200).json({ text: aiResponse });
    }

    await saveUserMessage(userId, userPrompt);

    let projectDetails = "";
    if (userPrompt.toLowerCase().includes("project with the most likes")) {
      const mostLikedProject = await Project.findOne()
        .sort({ likes: -1 })
        .populate({
          path: 'comments',
          select: 'comment userId',
          populate: { path: 'userId', select: 'userName' }, 
        });

      if (mostLikedProject) {
        projectDetails += `Project with the most likes:\n`;
        projectDetails += `Name: ${mostLikedProject.name}\n`;
        projectDetails += `Likes: ${mostLikedProject.likes}\n`;
        projectDetails += `Comments:\n`;
        mostLikedProject.comments.forEach((comment, idx) => {
          projectDetails += `  Comment ${idx + 1} by ${comment.userId?.userName || "Anonymous"}: ${comment.comment}\n`;
        });
      } else {
        projectDetails += "No projects found.\n";
      }
    } else {
      const projects = await Project.find().populate({
        path: 'comments',
        select: 'comment userId',
        populate: { path: 'userId', select: 'userName' },
      });

      projectDetails += "Here are all the projects in the system:\n\n";
      projects.forEach((project, index) => {
        projectDetails += `Project ${index + 1}:\n`;
        projectDetails += `Name: ${project.name}\n`;
        projectDetails += `Authors: ${project.authors.join(", ")}\n`;
        projectDetails += `Description: ${project.description}\n`;
        projectDetails += `Semester: ${project.semester}\n`;
        projectDetails += `Department: ${project.department}\n`;
        projectDetails += `Likes: ${project.likes}\n`;
        projectDetails += `Number of Comments: ${project.comments.length}\n`;
        projectDetails += `Views: ${project.views}\n`;

        if (project.comments.length > 0) {
          projectDetails += `Comments:\n`;
          project.comments.forEach((comment, idx) => {
            projectDetails += `  Comment ${idx + 1} by ${comment.userId?.userName || "Anonymous"}: ${comment.comment}\n`;
          });
        }
        projectDetails += "\n";
      });
    }

    const chatHistory = await getChatHistory(userId);
    const conversationContext = chatHistory.map(msg => `${msg.sender}: ${msg.message}`).join("\n");

    const fullPrompt = `${projectDetails}${conversationContext}\nUser: ${userPrompt}\nAI: `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiResponse = await response.text();

    await saveAiMessage(userId, aiResponse);

    res.status(200).json({ text: aiResponse });
  } catch (error) {
    console.error("Error generating prompt with AI:", error);
    res.status(500).json({ error: error.message });
  }
};

async function clearChatHistory(userId) {
  try {
    const result = await ChatHistory.deleteOne({ userId });
    if (result.deletedCount > 0) {
      console.log(`Chat history for user ${userId} has been cleared.`);
    } else {
      console.log(`No chat history found for user ${userId} to delete.`);
    }
  } catch (error) {
    console.error(`Error clearing chat history for user ${userId}:`, error);
  }
}

module.exports = { generatePrompt, clearChatHistory };