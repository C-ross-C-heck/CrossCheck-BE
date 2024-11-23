import React from 'react';
import Sidebar from '../../Sidebar/components/Sidebar';
import { useNavigate } from 'react-router-dom';
import '../css/history.css';

const History = () => {
  const navigate = useNavigate();

  const chatHistories = [
    { title: '전세를 위해 필요한 서류', time: '1시간 전' },
    { title: '전세사기 대처방법', time: '3일 전' },
    { title: '부동산 계약할 때 유의사항', time: '17일 전' },
    { title: '공인중개사가 되는 방법', time: '1달 전' }
  ];

  return (
    <div className="history-container">
      <Sidebar />
      <main className="history-main">
        <div className="history-header">
          <h1>Your chat history.</h1>
          <button className="new-chat-button" onClick={() => navigate('/chatbot')}>
            + start a new chat
          </button>
        </div>

        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search your chat"
              className="search-input"
            />
          </div>
        </div>

        <div className="chat-history-list">
          {chatHistories.map((chat, index) => (
            <div key={index} className="chat-history-item">
              <div className="chat-info">
                <h3>{chat.title}</h3>
                <span>{chat.time}</span>
              </div>
              <div className="chat-actions">
                <button className="edit-button">✏️</button>
                <button className="delete-button">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default History;