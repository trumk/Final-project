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
    
    const generalQuestions = ["what can you do", "what is your main function", "how can you help", "who are you",
      "bạn có thể làm gì", "chức năng chính của bạn là gì", "bạn có thể giúp gì", "bạn là ai", "hello", "hi", "chào", "xin chào", "hey", "yo"
    ];
    const isGeneralQuestion = generalQuestions.some(question => userPrompt.toLowerCase().includes(question));

    if (isGeneralQuestion) {
      const aiResponse = userPrompt.match(/[^\x00-\x7F]+/) 
        ? "Chào! Tôi là một AI được thiết kế để hỗ trợ bạn với các câu hỏi về Gree Project. Rất vui được giúp đỡ bạn 😊" 
        : "Hi! I'm an AI designed to assist you with questions about Gree Project. Happy to help 😊";
      await saveUserMessage(userId, userPrompt);
      await saveAiMessage(userId, aiResponse);
      return res.status(200).json({ text: aiResponse });
    }

    const commentTutorial = ["how to comment", "comment tutorial", "comment guide",
      "làm thế nào để bình luận", "hướng dẫn bình luận"
    ];
    const isCommentTutorial = commentTutorial.some(question => userPrompt.toLowerCase().includes(question));

    if (isCommentTutorial) {
      const aiResponse = userPrompt.match(/[^\x00-\x7F]+/) 
        ? 'Đầu tiên, bạn hãy chọn một dự án bất kỳ để xem chi tiết. Tiếp theo, bạn hãy nhìn lên góc trên bên phải màn hình sẽ có một ô nhập bình luận, bạn hãy nhập bình luận của mình tại đây. Cuối cùng, sau khi nhập bình luận xong thì bạn hãy ấn nút "Comment". Rất vui khi được giúp đỡ bạn 😊' 
        : 'First, select any project to view details. Next, look at the top right corner of the screen, there will be a comment box, enter your comment here. Finally, after entering your comment, click the "Comment" button. Happy to help you 😊';
      await saveUserMessage(userId, userPrompt);
      await saveAiMessage(userId, aiResponse);
      return res.status(200).json({ text: aiResponse });
    }

    const updateProfileTutorial = ["how to update my profile", "guide me to edit my profile", "update profile tutorial",
      "làm thế nào để cập nhật hồ sơ của tôi", "làm thế nào để cập nhật hồ sơ", "hướng dẫn tôi cập nhật hồ sơ", "hướng dẫn cập nhật hồ sơ"
    ];
    const isUpdateProfileTutorial = updateProfileTutorial.some(question => userPrompt.toLowerCase().includes(question));

    if (isUpdateProfileTutorial) {
      const aiResponse = /[^\x00-\x7F]+/.test(userPrompt) 
        ? 'Đầu tiên, bạn hãy nhìn lên góc trên bên phải màn hình, ở thanh điều hướng bạn sẽ thấy username của bạn. Tiếp theo, hãy ấn vào username của bạn, bạn sẽ thấy một menu xổ xuống, bạn hãy chọn "profile". Sau đó, ở trong trang profile, bạn sẽ thấy biểu tượng bút chì ở góc trên bên phải của thẻ hiển thị các thông tin cá nhân của bạn. Khi ấn vào biểu tượng bút chì, bạn có thể thay đổi ảnh đại diện, thay đổi username, thay đổi password. Bạn phải nhập mật khẩu của mình ở ô "Current Password" để có thể thay đổi các thông tin trên. Rất vui khi được giúp đỡ bạn 😊' 
        : 'First, look at the top right corner of the screen. In the navigation bar, you will see your username. Click on your username, and a dropdown menu will appear. From the menu, select "Profile". Next, on the profile page, you will see a pencil icon in the top right corner of the card displaying your personal information. Click on the pencil icon to edit your profile picture, username, or password. To save changes, you must enter your current password in the "Current Password" field. Happy to help you 😊';
      await saveUserMessage(userId, userPrompt);
      await saveAiMessage(userId, aiResponse);
      return res.status(200).json({ text: aiResponse });
    }

    const allowedKeywords = [
      "hi", "project", "comment", "comments", "like", "likes", "compare", "rate", "evaluate", "description",
      "about", "views", "view", "department", "semester", "author", "authors", "createdAt", "prompt", "question", "previous",
      "chào", "dự án", "bình luận", "lượt thích", "so sánh", "đánh giá", "mô tả", "lượt xem", "khoa", "học kỳ", "tác giả", "tạo vào ngày", "đường dẫn", "tiếng việt", "yêu cầu", "câu hỏi", "trước"
    ];
    const isRelevant = allowedKeywords.some(keyword => userPrompt.toLowerCase().includes(keyword));

    if (!isRelevant) {
      const aiResponse = userPrompt.match(/[^\x00-\x7F]+/) 
        ? "Xin lỗi, tôi chỉ có thể trả lời các câu hỏi về các dự án của trang web này." 
        : "Sorry, I can only answer questions about this website's projects.";
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
    } else if (userPrompt.toLowerCase().includes("project with the most likes", "dự án có số lượng lượt thích nhiều nhất")) {
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
