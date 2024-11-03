import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aiChat } from "../../redux/apiRequest"; 
import "./style.css";

function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const aiResponse = useSelector((state) => state.ai.response); 
  const isFetching = useSelector((state) => state.ai.isFetching);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (input.trim() && currentUser) {
      const userMessage = { text: input, sender: "user" };
      setMessages([...messages, userMessage, { text: "AI is thinking...", sender: "ai" }]);
      
      dispatch(aiChat(input, currentUser.id)); 
      setInput(""); 
    }
  };

  useEffect(() => {
    if (aiResponse) {
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), 
        { text: aiResponse, sender: "ai" },
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
                {msg.sender === "ai" && (
                  <img
                    src="/imgs/meowAI.jpg"
                    alt="AI Avatar"
                    className="ai-avatar"
                  />
                )}
                <span>{msg.text}</span>
              </div>
            ))}
            {isFetching && <div className="loading">AI is processing...</div>}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isFetching}
            />
            <button onClick={sendMessage} disabled={isFetching}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChat;