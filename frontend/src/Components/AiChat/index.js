import React, { useState } from "react";
import "./style.css";

function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "AI is thinking...", sender: "ai" },
      ]);
      setInput(""); 

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), 
          { text: "Here is AI's response!", sender: "ai" }, 
        ]);
      }, 1000);
    }
  };

  return (
    <div className={`chat-container ${isOpen ? "open" : ""}`}>
      {/* Ẩn biểu tượng khi cuộc hội thoại mở */}
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
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChat;
