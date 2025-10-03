import React, { useState } from 'react'
import './Query.css';
import axios from 'axios';

const Query = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    const userMessage = { type: 'user', text: query, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:3001/api/query', { query });
      const botMessage = { type: 'bot', text: res.data.answer, id: Date.now() + 1 };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = { type: 'bot', text: 'Error fetching insights', id: Date.now() + 1 };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="chat-icon" onClick={() => setIsOpen(true)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <p>👋 Hi! Ask me anything about your portfolio or market insights.</p>
              </div>
            )}
            {messages.map(message => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-content loading">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              value={query}
              placeholder="Ask about your portfolio..."
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button onClick={handleSubmit} disabled={loading || !query.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="m22 2-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Query;
