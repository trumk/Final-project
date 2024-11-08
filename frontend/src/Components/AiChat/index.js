import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aiChat } from "../../redux/apiRequest";
import "./style.css";
import LoginModal from "../LoginModal/LoginModal"; 

function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const dispatch = useDispatch();

  const aiResponse = useSelector((state) => state.ai.response);
  const isFetching = useSelector((state) => state.ai.isFetching);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = (e) => {
    e.preventDefault(); 
    
    if (!currentUser) {
      setIsModalOpen(true); 
      return;
    }
    
    if (input.trim()) {
      const userMessage = {
        text: input,
        sender: "user",
        avatar: currentUser?.avatar,
      };
      setMessages([
        ...messages,
        userMessage,
        { text: "AI is thinking...", sender: "ai", avatar: "/imgs/meowAI.jpg" },
      ]);

      dispatch(aiChat(input, currentUser.id));
      setInput("");
    }
  };

  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") 
      .replace(/\*\s*/g, "")
      .replace(/([A-Za-z\s]+):/g, "$1: ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Za-z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/([a-zA-Z])\b(with)\b/g, "$1 $2")
      .replace(/(\d)([a-zA-Z])/g, "$1 $2")  
      .replace(/\s+/g, " ")
      .trim();
  };
  
  useEffect(() => {
    if (aiResponse) {
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { text: formatResponse(aiResponse), sender: "ai" },
      ]);
    }
  }, [aiResponse]);

  return (
    <div className={`chat-container ${isOpen ? "open" : ""}`}>
      {!isOpen && (
        <div className="chat-icon" onClick={toggleChat}>
          <img
            src="https://img.icons8.com/ios-filled/50/000000/chat.png"
            alt="Chat"
          />
        </div>
      )}

      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <h4>AI Chat</h4>
            <button className="close-btn" onClick={toggleChat}>
              &times;
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === "ai" ? (
                  <img
                    src="/imgs/meowAI.jpg"
                    alt="AI Avatar"
                    className="chat-avatar"
                  />
                ) : (
                  <img
                    src={currentUser?.avatar}
                    alt="User Avatar"
                    className="chat-avatar"
                  />
                )}
                <span dangerouslySetInnerHTML={{ __html: msg.text }}></span>
              </div>
            ))}
            {isFetching && <div className="loading">AI is processing...</div>}
          </div>

          <form className="chat-footer" onSubmit={sendMessage}> 
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isFetching}
            />
            <button type="submit" disabled={isFetching}>
              Send
            </button>
          </form>
        </div>
      )}

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default AIChat;