// Sử dụng cú pháp import ESM
import generativeAi from '@google/generative-ai';
import Project from '../models/Project.js';
import User from '../models/User.js';

// Khởi tạo Google Generative AI Client
const client = new generativeAi.TextServiceClient({
    apiKey: process.env.GOOGLE_API_KEY || "AIzaSyAGzFab5Jp8cmCd9C8LSsRkN33uuz8EwVM",
});

const getAIResponseWithUserData = async (req, res) => {
    const userId = req.cookies.userId;
    const prompt = req.body.prompt;

    try {
        // Lấy thông tin người dùng hiện tại
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Lấy dữ liệu các dự án
        const projects = await Project.find();

        // Tạo prompt kết hợp dữ liệu người dùng và dự án
        const combinedPrompt = `User information: ${JSON.stringify({
            userName: currentUser.userName,
            email: currentUser.email,
            role: currentUser.role,
        })}. Project data: ${JSON.stringify(projects)}. ${prompt}`;

        // Gửi yêu cầu đến Google Generative AI
        const [response] = await client.generateText({
            model: 'models/text-bison-001', // Chọn model phù hợp
            prompt: combinedPrompt,
            temperature: 0.7,
            maxOutputTokens: 200,
        });

        // Xử lý phản hồi từ Google Generative AI
        res.json({ response: response.candidates[0].output });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process AI request', error });
    }
};

export {
    getAIResponseWithUserData,
};
