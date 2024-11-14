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
    const baseUrl = process.env.BASE_URL;

    if (!userId) {
      return res.status(401).json({ message: "User is not authenticated." });
    }
    if (!userPrompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const generalQuestions = ["what can you do", "what is your main function", "how can you help", "who are you"];
    const isGeneralQuestion = generalQuestions.some(question => userPrompt.toLowerCase().includes(question));

    if (isGeneralQuestion) {
      const aiResponse = "I am an AI designed to assist you with any questions regarding the Gree Project.";
      await saveUserMessage(userId, userPrompt);
      await saveAiMessage(userId, aiResponse);
      return res.status(200).json({ text: aiResponse });
    }

    const allowedKeywords = [
      "hi", "project", "comment", "comments", "like", "likes", "compare", "rate", "evaluate", "description",
      "about", "views", "view", "department", "semester", "author", "authors", "createdAt", "you",
      "chào", "bạn", "dự án", "bình luận", "thích", "so sánh", "đánh giá", "mô tả", "xem", "khoa", "học kỳ", "tác giả", "tạo vào ngày", "đường dẫn"
    ];
    const isRelevant = allowedKeywords.some(keyword => userPrompt.toLowerCase().includes(keyword));

    if (!isRelevant) {
      const aiResponse = "Sorry, I can only answer questions about this website's projects.";
      await saveUserMessage(userId, userPrompt);
      await saveAiMessage(userId, aiResponse);
      return res.status(200).json({ text: aiResponse });
    }

    await saveUserMessage(userId, userPrompt);

    let projectDetails = "";

    if (userPrompt.toLowerCase().includes("project created the earliest") || userPrompt.toLowerCase().includes("project created first")) {
      const earliestProject = await Project.find().sort({ createdAt: 1 }).limit(1).populate({
        path: 'comments',
        select: 'comment userId',
        populate: { path: 'userId', select: 'userName' },
      });

      if (earliestProject.length > 0) {
        projectDetails += `The earliest project is "${earliestProject[0].name}" (${baseUrl}/project/${earliestProject[0]._id}) created on ${earliestProject[0].createdAt}.\n`;
      } else {
        projectDetails += "No projects found.\n";
      }
    } else if (userPrompt.toLowerCase().includes("project with the most likes")) {
      const mostLikedProject = await Project.findOne()
        .sort({ likes: -1 })
        .populate({
          path: 'comments',
          select: 'comment userId',
          populate: { path: 'userId', select: 'userName' },
        });

      if (mostLikedProject) {
        projectDetails += `The project with the most likes is "${mostLikedProject.name}" (${baseUrl}/project/${mostLikedProject._id}) with ${mostLikedProject.likes} likes.\n`; 
      } else {
        projectDetails += "No projects found.\n";
      }
    } else {
      const projects = await Project.find().populate({
        path: 'comments',
        select: 'comment userId',
        populate: { path: 'userId', select: 'userName' },
      });

      projectDetails += "Here are all the projects on the website:\n\n";
      projects.forEach((project) => {
        projectDetails += `Name: ${project.name} (${baseUrl}/project/${project._id})\n`; 
        projectDetails += `Authors: ${project.authors.join(", ")}\n`;
        projectDetails += `Description: ${project.description} \n`; 
        projectDetails += `Semester: ${project.semester} \n`;
        projectDetails += `Department: ${project.department} \n`; 
        projectDetails += `Likes: ${project.likes} \n`; 
        projectDetails += `Number of Comments: ${project.comments.length} \n`;
        projectDetails += `Views: ${project.views} \n`;
        projectDetails += `Created At: ${project.createdAt} \n`;

        if (project.comments.length > 0) {
          projectDetails += `Comments:\n`;
          project.comments.forEach((comment, idx) => {
            projectDetails += `  Comment ${idx + 1} by ${comment.userId?.userName || "Anonymous"}: ${comment.comment} \n`; 
          });
        }
        projectDetails += "\n";
      });
    }

    const chatHistory = await getChatHistory(userId);
    const conversationContext = chatHistory.map(msg => `${msg.sender}: ${msg.message}`).join("\n");

    const fullPrompt = `${projectDetails}${conversationContext}\nUser: ${userPrompt} (sorted by createdAt)\nAI: (respond briefly)`;

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
